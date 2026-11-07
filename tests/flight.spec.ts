import { test, expect } from '@playwright/test';
test('aircraft selection, flight, pause, stop and restart', async ({ page }) => {
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('/');await expect(page.locator('#app')).toHaveAttribute('data-ready','true');await expect(page.getByLabel('SKYHOP 3D world')).toBeVisible();
 await expect(page.locator('.aircraft-name')).toHaveText('The Explorer');await page.keyboard.press('ArrowRight');await expect(page.locator('.aircraft-name')).toHaveText('The Voyager',{timeout:5000});
 await page.keyboard.press('ArrowRight');await expect(page.locator('.aircraft-name')).toHaveText('The Explorer',{timeout:5000});
 await page.mouse.move(240,500);await page.mouse.down();await page.mouse.move(80,500,{steps:5});await page.mouse.up();await expect(page.locator('.aircraft-name')).toHaveText('The Voyager',{timeout:5000});
 await page.keyboard.press('ArrowLeft');await expect(page.locator('.aircraft-name')).toHaveText('The Explorer',{timeout:5000});
 await page.keyboard.press('Enter');await expect(page.locator('#app')).toHaveAttribute('data-state','transitioning');await expect(page.locator('.hud')).toHaveClass(/visible/);await expect(page.locator('#app')).toHaveAttribute('data-state','takeoff',{timeout:5000});await expect(page.locator('#app')).toHaveAttribute('data-state','flying',{timeout:6000});
 const initial=await page.locator('[data-speed]').textContent();await page.keyboard.press('Escape');await expect(page.locator('.pause-overlay')).toBeVisible();await page.waitForTimeout(250);await expect(page.locator('[data-speed]')).toHaveText(initial!);await page.getByRole('button',{name:'Resume'}).click();await expect(page.locator('.pause-overlay')).toBeHidden();await expect(page.locator('#app')).toHaveAttribute('data-state','flying');
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Stop flight'}).click();await expect(page.locator('#app')).toHaveAttribute('data-state','selection',{timeout:5000});await expect(page.locator('.aircraft-name')).toHaveText('The Explorer');await expect(page.locator('.hud')).not.toHaveClass(/visible/);
 await page.keyboard.press('Enter');await expect(page.locator('#app')).toHaveAttribute('data-state','transitioning');await expect(page.locator('#app')).toHaveAttribute('data-state','takeoff',{timeout:5000});
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Stop flight'}).click();await expect(page.locator('#app')).toHaveAttribute('data-state','selection',{timeout:5000});await page.setViewportSize({width:390,height:844});await expect(page.getByLabel('SKYHOP 3D world')).toBeVisible();expect(errors).toEqual([]);
});
