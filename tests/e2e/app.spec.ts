import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { devices, expect, test } from '@playwright/test';

const auditDir = path.resolve(process.cwd(), 'work', 'audit');

async function ensureAuditDir() {
  await mkdir(auditDir, { recursive: true });
}

test('home -> love channel -> LBTI result flow exports poster', async ({ page }) => {
  await ensureAuditDir();

  await page.goto('/');
  await expect(page.getByTestId('home-category-grid')).toBeVisible();
  await expect(page.getByTestId('home-type-wall')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '01-home.png'), fullPage: true });

  await page
    .getByTestId('home-category-grid')
    .getByRole('link', { name: /恋爱系人格/i })
    .click();
  await expect(page).toHaveURL(/\/love\/$/);
  await expect(page.getByTestId('category-type-wall')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '02-love-category.png'), fullPage: true });

  await page.getByRole('link', { name: /进入 LBTI/i }).first().click();
  await expect(page).toHaveURL(/\/lbti\/$/);
  await expect(page.getByTestId('method-grid')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '03-lbti-intro.png'), fullPage: true });

  await page.getByRole('button', { name: '开始这个测试' }).first().click();

  for (let index = 0; index < 30; index += 1) {
    await page.getByTestId('answer-a').click();
  }

  await expect(page.getByTestId('result-panel')).toBeVisible();
  await expect(page.getByTestId('result-name')).toContainText('恋爱项目经理');
  await expect(page.getByTestId('recommendation-strip')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '04-lbti-result.png'), fullPage: true });

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '保存结果海报' }).click();
  const download = await downloadPromise;
  await download.saveAs(path.join(auditDir, '05-lbti-poster.png'));
});

test('shared engine still serves WBTI after the love-first redesign', async ({ page }) => {
  await ensureAuditDir();

  await page.goto('/wbti/');
  await expect(page.getByTestId('method-grid')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '06-wbti-intro.png'), fullPage: true });

  await page.getByRole('button', { name: '开始这个测试' }).first().click();

  for (let index = 0; index < 10; index += 1) {
    await page.getByTestId('answer-a').click();
  }

  await expect(page.getByTestId('result-panel')).toBeVisible();
  await expect(page.getByTestId('result-name')).toContainText('背锅缓冲垫');
  await page.screenshot({ path: path.join(auditDir, '07-wbti-result.png'), fullPage: true });
});

test.describe('mobile', () => {
  test.use({
    viewport: devices['iPhone 13'].viewport,
    userAgent: devices['iPhone 13'].userAgent,
    deviceScaleFactor: devices['iPhone 13'].deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
  });

  test('LBTI flow remains readable and tappable', async ({ page }) => {
    await ensureAuditDir();

    await page.goto('/lbti/');
    await expect(page.getByRole('button', { name: '开始这个测试' }).first()).toBeVisible();
    await page.screenshot({ path: path.join(auditDir, '08-lbti-mobile-home.png'), fullPage: true });

    await page.getByRole('button', { name: '开始这个测试' }).first().click();

    for (let index = 0; index < 6; index += 1) {
      await page.getByTestId('answer-a').click();
    }

    await expect(page.getByTestId('quiz-runner')).toBeVisible();
    await page.screenshot({ path: path.join(auditDir, '09-lbti-mobile-quiz.png'), fullPage: true });
  });
});
