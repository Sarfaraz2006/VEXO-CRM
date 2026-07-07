#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.parse
from datetime import datetime

config_path = "/root/leads-crm/reminder_config.json"
local_db_path = "/root/leads-crm/src/seedLeads.json"

def get_days_diff(date_str1, date_str2):
    try:
        d1 = datetime.strptime(date_str1, "%Y-%m-%d")
        d2 = datetime.strptime(date_str2, "%Y-%m-%d")
        return (d1 - d2).days
    except Exception:
        return 0

def load_leads_from_sheets(sheet_id, api_key):
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/Leads!A:Z?key={api_key}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            rows = data.get("values", [])
            if not rows:
                return []
            
            headers = [h.strip().lower().replace(" ", "_") for h in rows[0]]
            leads = []
            for row in rows[1:]:
                lead = {}
                for idx, header in enumerate(headers):
                    if idx < len(row):
                        lead[header] = row[idx]
                    else:
                        lead[header] = ""
                leads.append(lead)
            return leads
    except Exception as e:
        print(f"Error fetching from Google Sheets: {e}")
        return None

def check_followups(leads):
    today_str = datetime.now().strftime("%Y-%m-%d")
    followups = []
    
    for l in leads:
        status = l.get("outreach_status", "Not Contacted")
        if status in ["Closed Won", "Closed Lost", "Not Interested"]:
            continue
            
        follow_up_date = l.get("follow_up_date", "")
        last_contacted = l.get("last_contacted", "")
        
        is_overdue = follow_up_date and follow_up_date <= today_str
        
        is_old_messaged = False
        if status == "Messaged" and last_contacted:
            diff = get_days_diff(today_str, last_contacted)
            is_old_messaged = diff >= 3
            
        if is_overdue or is_old_messaged:
            followups.append({
                "business_name": l.get("business_name", "Unknown Lead"),
                "status": status,
                "reason": "Overdue follow-up" if is_overdue else "Messaged 3+ days ago",
                "phone": l.get("phone", "N/A"),
                "date": follow_up_date or last_contacted
            })
            
    return followups

def send_telegram_message(token, chat_id, message):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }).encode("utf-8")
    
    try:
        req = urllib.request.Request(url, data=data)
        with urllib.request.urlopen(req, timeout=10) as response:
            res = json.loads(response.read().decode())
            return res.get("ok", False)
    except Exception as e:
        print(f"Error sending Telegram notification: {e}")
        return False

def main():
    print(f"[{datetime.now()}] Running daily follow-up checker...")
    
    config = {}
    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            config = json.load(f)
            
    telegram_token = config.get("telegram_token", "")
    telegram_chat_id = config.get("telegram_chat_id", "")
    
    sheet_id = config.get("google_sheet_id", "")
    api_key = config.get("google_api_key", "")
    
    if not telegram_token or not telegram_chat_id:
        print("Telegram configuration missing in reminder_config.json. Skipping notification.")
        return
        
    leads = None
    if sheet_id and api_key:
        print("Fetching latest leads from Google Sheets...")
        leads = load_leads_from_sheets(sheet_id, api_key)
        
    if leads is None:
        print("Falling back to local leads database...")
        local_backup = "/root/leads-crm/src/leads_backup.json"
        db_to_use = local_backup if os.path.exists(local_backup) else local_db_path
        
        with open(db_to_use, "r") as f:
            leads = json.load(f)
            
    followups = check_followups(leads)
    
    if not followups:
        print("No follow-ups needed today.")
        return
        
    msg_lines = [
        "📊 <b>VEXO CRM Daily Follow-up Reminder</b>",
        f"You have <b>{len(followups)}</b> leads that require action today:\n"
    ]
    
    for idx, f in enumerate(followups, 1):
        msg_lines.append(
            f"{idx}. <b>{f['business_name']}</b>\n"
            f"   • Reason: {f['reason']}\n"
            f"   • Status: {f['status']} (Date: {f['date']})\n"
            f"   • Contact: {f['phone']}\n"
        )
        
    msg_lines.append("<i>Log into your VEXO CRM web app to take action!</i>")
    message = "\n".join(msg_lines)
    
    success = send_telegram_message(telegram_token, telegram_chat_id, message)
    if success:
        print("Notification sent successfully to Telegram!")
    else:
        print("Failed to send Telegram notification.")

if __name__ == "__main__":
    main()
