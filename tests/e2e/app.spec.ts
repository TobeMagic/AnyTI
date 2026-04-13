import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const auditDir = path.resolve(process.cwd(), 'work', 'audit');

async function ensureAuditDir() {
  await mkdir(auditDir, { recursive: true });
}

test('homepage to WBTI result flow exports poster and recommendations', async ({ page }) => {
  await ensureAuditDir();

  await page.goto('/');
  await expect(page.getByTestId('home-category-grid')).toBeVisible();
  await expect(page.getByTestId('home-type-wall')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '01-home.png'), fullPage: true });

  await page
    .getByTestId('home-category-grid')
    .getByRole('link', { name: /职场系人格/i })
    .click();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.getByTestId('category-type-wall')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '02-work-category.png'), fullPage: true });

  await page.getByRole('link', { name: /进入 WBTI/i }).click();
  await expect(page).toHaveURL(/\/wbti\/$/);
  await expect(page.getByTestId('method-grid')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '03-wbti-intro.png'), fullPage: true });

  await page.getByRole('button', { name: '开始这个测试' }).click();

  for (let index = 0; index < 10; index += 1) {
    await page.getByTestId('answer-a').click();
  }

  await expect(page.getByTestId('result-panel')).toBeVisible();
  await expect(page.getByTestId('result-name')).toContainText('背锅缓冲垫');
  await expect(page.getByTestId('recommendation-strip')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '04-wbti-result.png'), fullPage: true });

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '保存结果海报' }).click();
  const download = await downloadPromise;
  await download.saveAs(path.join(auditDir, '05-wbti-poster.png'));
});

test('love category and LBTI prove the second pack runs on the shared engine', async ({ page }) => {
  await ensureAuditDir();

  await page.goto('/love/');
  await expect(page.getByTestId('category-type-wall')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '06-love-category.png'), fullPage: true });

  await page.getByRole('link', { name: /进入 LBTI/i }).click();
  await expect(page).toHaveURL(/\/lbti\/$/);
  await page.getByRole('button', { name: '开始这个测试' }).click();

  for (let index = 0; index < 10; index += 1) {
    await page.getByTestId('answer-a').click();
  }

  await expect(page.getByTestId('result-panel')).toBeVisible();
  await expect(page.getByTestId('result-name')).toContainText('秒回幻觉师');
  await page.screenshot({ path: path.join(auditDir, '07-lbti-result.png'), fullPage: true });
});
