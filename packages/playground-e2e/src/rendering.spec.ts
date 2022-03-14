import { test, expect } from '@playwright/test';
import * as env from './env';

test.describe.parallel('Rendering', () => {
  test('Logo was found', async ({ page }) => {
    await page.goto(env.PLAYGROUND_URL);
    const logo = page.locator('data-test-id=headerLogo');
    await expect(logo);
  });

  test('Title was found', async ({ page }) => {
    await page.goto(env.PLAYGROUND_URL);
    const title = page.locator('title');
    await expect(title).toHaveText('ink! Playground');
  });

  test('Compile button was found', async ({ page }) => {
    await page.goto(env.PLAYGROUND_URL);
    const menuElement = page.locator('button:has-text("Compile")');
    await expect(menuElement).toHaveText('Compile');
  });

  test('Download button was found', async ({ page }) => {
    await page.goto(env.PLAYGROUND_URL);
    const menuElement = page.locator('button:has-text("Download")');
    await expect(menuElement).toHaveText('Download');
  });

  test('Share button was found', async ({ page }) => {
    await page.goto(env.PLAYGROUND_URL);
    const menuElement = page.locator('button:has-text("Share")');
    await expect(menuElement).toHaveText('Share');
  });

  test('Settings button was found', async ({ page }) => {
    await page.goto(env.PLAYGROUND_URL);
    const menuElement = page.locator('button:has-text("Settings")');
    await expect(menuElement).toHaveText('Settings');
  });

  test('GitHub Repo button was found', async ({ page }) => {
    await page.goto(env.PLAYGROUND_URL);
    const menuElement = page.locator('button:has-text("GitHub Repo")');
    await expect(menuElement).toHaveText('GitHub Repo');
  });
});
