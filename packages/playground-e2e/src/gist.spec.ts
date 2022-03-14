import { test, expect } from '@playwright/test';
import * as env from './env';

test('gist URL works', async ({ page }) => {
  await page.goto(env.PLAYGROUND_URL + '?id=b1af981d1875f809b0198e7b169a3ef5');
  const title = page.locator('title');
  await expect(title).toHaveText('ink! Playground');
});
