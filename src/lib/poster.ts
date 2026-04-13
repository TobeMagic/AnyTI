import QRCode from 'qrcode';
import type { Category, DimensionSummary, Personality, TestPack } from './types';

type PosterContext = {
  category: Category;
  pack: TestPack;
  result: Personality;
  dimensions: DimensionSummary[];
  permalink: string;
};

function hexToRgba(hex: string, alpha = 1) {
  const normalized = hex.replace('#', '');
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function buildPosterBlob({
  category,
  pack,
  result,
  dimensions,
  permalink,
}: PosterContext) {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1440;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is unavailable in this browser.');
  }

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, category.theme.surface);
  gradient.addColorStop(1, hexToRgba(category.theme.accentSoft, 0.92));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = hexToRgba(category.theme.accent, 0.12);
  ctx.beginPath();
  ctx.arc(width - 160, 170, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150, height - 140, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(72, 72, width - 144, height - 144);

  ctx.fillStyle = category.theme.accent;
  ctx.fillRect(72, 72, width - 144, 18);

  ctx.fillStyle = '#10202A';
  ctx.font = '700 30px "Bricolage Grotesque", "Noto Sans SC", sans-serif';
  ctx.fillText(pack.meta.title, 120, 154);
  ctx.font = '400 24px "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#52606D';
  ctx.fillText(pack.meta.hook, 120, 196);

  ctx.fillStyle = category.theme.accent;
  ctx.font = '700 92px "Bricolage Grotesque", "Noto Sans SC", sans-serif';
  ctx.fillText(result.name, 120, 318, width - 240);

  ctx.fillStyle = '#13202A';
  ctx.font = '600 34px "Noto Sans SC", sans-serif';
  ctx.fillText(result.badge, 120, 374);

  ctx.fillStyle = category.theme.accentSoft;
  ctx.beginPath();
  ctx.roundRect(120, 420, 320, 320, 36);
  ctx.fill();

  ctx.fillStyle = hexToRgba(category.theme.accent, 0.75);
  ctx.beginPath();
  ctx.arc(280, 548, 88, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(280, 506, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(224, 560, 112, 88);

  ctx.fillStyle = '#13202A';
  ctx.font = '600 30px "Noto Sans SC", sans-serif';
  ctx.fillText(result.vibe, 470, 468, 460);
  ctx.font = '400 25px "Noto Sans SC", sans-serif';

  const wrap = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const chars = text.split('');
    let line = '';
    let currentY = y;

    for (const char of chars) {
      const next = line + char;
      if (ctx.measureText(next).width > maxWidth) {
        ctx.fillText(line, x, currentY);
        line = char;
        currentY += lineHeight;
      } else {
        line = next;
      }
    }

    if (line) {
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    }

    return currentY;
  };

  ctx.fillStyle = '#41505C';
  const nextY = wrap(result.summary, 470, 520, 460, 38);

  ctx.fillStyle = '#13202A';
  ctx.font = '600 28px "Noto Sans SC", sans-serif';
  ctx.fillText('你现在更像这样', 120, 834);

  dimensions.slice(0, 4).forEach((dimension, index) => {
    const top = 886 + index * 92;
    ctx.fillStyle = '#13202A';
    ctx.font = '600 24px "Noto Sans SC", sans-serif';
    ctx.fillText(dimension.title, 120, top);

    ctx.fillStyle = '#6B7985';
    ctx.font = '400 20px "Noto Sans SC", sans-serif';
    ctx.fillText(dimension.leftLabel, 120, top + 30);
    ctx.fillText(dimension.rightLabel, 830, top + 30);

    ctx.fillStyle = '#E8EEF1';
    ctx.fillRect(120, top + 44, 760, 16);

    const normalized = (dimension.score + 100) / 200;
    ctx.fillStyle = category.theme.accent;
    ctx.fillRect(120, top + 44, 760 * normalized, 16);
  });

  const qrData = await QRCode.toDataURL(permalink, {
    margin: 0,
    width: 180,
    color: {
      dark: '#13202A',
      light: '#FFFFFF',
    },
  });
  const qr = new Image();
  qr.src = qrData;
  await qr.decode();
  ctx.drawImage(qr, 760, height - 326, 180, 180);

  ctx.fillStyle = '#13202A';
  ctx.font = '600 24px "Noto Sans SC", sans-serif';
  ctx.fillText('扫回这个测试', 760, height - 118);
  ctx.fillStyle = '#55636F';
  ctx.font = '400 20px "Noto Sans SC", sans-serif';
  ctx.fillText('AnyTI · 先看分类，再进测试', 120, height - 110);

  return new Promise<Blob>((resolvePromise, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Poster export failed.'));
        return;
      }
      resolvePromise(blob);
    }, 'image/png');
  });
}
