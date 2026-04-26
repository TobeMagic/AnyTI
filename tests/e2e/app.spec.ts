import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { devices, expect, test } from '@playwright/test';

const auditDir = path.resolve(process.cwd(), 'work', 'audit');

async function ensureAuditDir() {
  await mkdir(auditDir, { recursive: true });
}

test('home opens as a focused LBTI start page and routes into quiz', async ({ page }) => {
  await ensureAuditDir();

  await page.goto('/');
  await page.waitForTimeout(900);
  await expect(page.getByTestId('hero-start')).toBeVisible();
  await expect(page.getByText(/MBTI测不出你/)).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '01-home.png'), fullPage: true });

  await page.getByTestId('hero-start').click();
  await expect(page).toHaveURL(/\/test\/(?:\?lang=en)?$/);
  await page.getByRole('button', { name: '开始测试' }).click();
  await expect(page.getByTestId('quiz-runner')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '03-lbti-intro.png'), fullPage: true });

  for (let index = 0; index < 30; index += 1) {
    await page.getByTestId('answer-a').click({ force: true });
    if (index === 29) {
      await expect(page.getByTestId('quiz-next')).toBeEnabled();
      await page.getByTestId('quiz-next').click({ force: true });
      await expect(page.getByTestId('result-panel')).toBeVisible({ timeout: 10000 });
    } else {
      const nextLabel = `${index + 2} / 30`;
      await expect(page.getByTestId('quiz-progress')).toHaveText(nextLabel, { timeout: 5000 });
    }
  }

  await expect(page.getByTestId('result-name').first()).toHaveText(/\S+/);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(auditDir, '04-lbti-result.png'), fullPage: true });

  await page.getByRole('button', { name: '分享图片', exact: true }).click();
  await expect(page.locator('.ref-share-preview-backdrop')).toBeVisible();
  await expect(page.getByAltText(/分享图片预览/)).toBeVisible();
  await expect(page.getByText('长按保存图片并转发')).toBeVisible();
  await page.screenshot({ path: path.join(auditDir, '05-lbti-poster-preview.png'), fullPage: true });
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

    await page.goto('/');
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(auditDir, '08-lbti-mobile-home.png'), fullPage: true });

    await page.getByTestId('hero-start').click();
    await page.getByRole('button', { name: '开始测试' }).click();
    await expect(page.getByTestId('quiz-runner')).toBeVisible();

    for (let index = 0; index < 6; index += 1) {
      await page.getByTestId('answer-a').click({ force: true });
      const nextLabel = `${index + 2} / 30`;
      await expect(page.getByTestId('quiz-progress')).toHaveText(nextLabel, { timeout: 5000 });
    }

    await expect(page.getByTestId('quiz-runner')).toBeVisible();
    await page.screenshot({ path: path.join(auditDir, '09-lbti-mobile-quiz.png'), fullPage: true });
  });
});
