#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright
import os

async def capture_state(page, name, action=None):
    output_dir = "/root/.hermes/fake_home/.gemini/antigravity-cli/brain/d2886c26-6a56-48c0-b746-b21dcc0f5a27"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"leads_crm_{name}.png")
    
    if action:
        print(f"Performing action for '{name}'...")
        await action(page)
        # Give short delay for React state/animations
        await asyncio.sleep(1.5)
        
    print(f"Taking screenshot: {output_path}...")
    await page.screenshot(path=output_path, full_page=False)

async def main():
    url = "http://localhost:3001/"
    print(f"Connecting to {url}...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        try:
            await page.goto(url, wait_until="networkidle", timeout=15000)
            await asyncio.sleep(2)
            
            # 1. Base Dashboard
            await capture_state(page, "dashboard")
            
            # 2. Open Add Lead Drawer
            async def open_add_lead(p):
                await p.click('button:has-text("Add Lead")')
            await capture_state(page, "add_lead", open_add_lead)
            
            # Close the Add Lead drawer by clicking backdrop or X
            async def close_drawer(p):
                await p.click('button:has-text("Cancel")')
            await close_drawer(page)
            await asyncio.sleep(0.5)
            
            # 3. Open Lead Detail Drawer
            async def open_detail(p):
                # Click the first row or search for "318 Dental Practice"
                await p.click('td:has-text("318 Dental Practice")')
            await capture_state(page, "lead_detail", open_detail)
            
            # Close Lead Detail
            async def close_detail(p):
                await p.click('button:has-text("Close Profile")')
            await close_detail(page)
            await asyncio.sleep(0.5)
            
            # 4. Open Settings Modal
            async def open_settings(p):
                await p.click('button[title="Settings"]')
            await capture_state(page, "settings", open_settings)
            
            # Close settings
            await page.click('button:has-text("Cancel")')
            await asyncio.sleep(0.5)
            
            # 5. Open Analytics Tab
            async def open_analytics(p):
                await p.click('button:has-text("Analytics")')
            await capture_state(page, "analytics", open_analytics)
            
            # Go back to Leads Tab
            await page.click('button:has-text("Leads")')
            await asyncio.sleep(0.5)
            
            # 6. Click Theme toggle to switch to Light Mode
            async def switch_theme(p):
                await p.click('button[title*="Light Mode"]')
            await capture_state(page, "dashboard_light", switch_theme)
            
            # 7. Open Analytics Tab in Light Mode
            async def open_analytics_light(p):
                await p.click('button:has-text("Analytics")')
            await capture_state(page, "analytics_light", open_analytics_light)
            
            print("All screenshots taken successfully!")
            
        except Exception as e:
            print(f"Error during execution: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
