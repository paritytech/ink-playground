import { test, expect } from '@playwright/test';
import * as env from './env';

test.describe.parallel('RA', () => {
  test('Rust analyzer started', async ({ page }) => {
    await page.goto(env.PLAYGROUND_URL);
    const loadingAnalyzer = page.locator('data-testid=message-0-IN_PROGRESS');
    await expect(loadingAnalyzer).toHaveText('SYSTEM:Loading Rust Analyzer...');
  });

  /* This test is tricky, because it takes long and fails with multiple workers. */
  // test('Rust analyzer loaded', async ({ page }) => {
  //   await page.goto(env.PLAYGROUND_URL);
  //   const loadedAnalyzer = page.locator('data-testid=message-0-DONE');
  //   await expect(loadedAnalyzer).toHaveText('SYSTEM:Rust Analyzer Ready', { timeout: 50000 });
  // });
});
