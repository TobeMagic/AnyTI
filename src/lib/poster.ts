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

  ctx.fillStyle = '#fff8f4';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = hexToRgba(category.theme.accentSoft, 0.88);
  ctx.beginPath();
  ctx.arc(width - 90, 120, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(64, height - 80, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'rgba(29, 23, 32, 0.14)';
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#fffdfb';
  ctx.beginPath();
  ctx.roundRect(56, 56, width - 112, height - 112, 42);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = category.theme.accent;
  ctx.beginPath();
  ctx.roundRect(56, 56, width - 112, 20, 20);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(96, 110, 248, 44, 22);
  ctx.fill();
  ctx.fillStyle = '#1d1720';
  ctx.font = '700 22px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText('ANYTI LOVE PROFILE', 120, 139);

  ctx.fillStyle = '#1d1720';
  ctx.font = '700 28px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText(pack.meta.title, 96, 214);

  ctx.fillStyle = '#6b6571';
  ctx.font = '500 22px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText(pack.meta.hook, 96, 252);

  ctx.fillStyle = '#18131c';
  ctx.font = '800 88px "Newsreader", "Noto Serif SC", serif';
  ctx.fillText(result.name, 96, 362, width - 192);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(96, 390, 248, 52, 26);
  ctx.fill();
  ctx.fillStyle = category.theme.accent;
  ctx.font = '800 28px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText(result.badge, 122, 424);

  ctx.fillStyle = category.theme.accentSoft;
  ctx.beginPath();
  ctx.roundRect(96, 478, 320, 320, 42);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  ctx.roundRect(124, 506, 264, 264, 34);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(174, 564, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(332, 540, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(138, 712);
  ctx.quadraticCurveTo(244, 640, 372, 628);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.beginPath();
  ctx.roundRect(160, 548, 190, 162, 30);
  ctx.fill();
  ctx.fillStyle = category.theme.accent;
  ctx.font = '800 92px "Newsreader", "Noto Serif SC", serif';
  ctx.fillText(Array.from(result.name)[0] ?? 'A', 222, 658);

  ctx.fillStyle = '#1d1720';
  ctx.font = '700 32px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText('Quick Read', 458, 510);

  ctx.fillStyle = '#6b6571';
  ctx.font = '500 24px "Manrope", "Noto Sans SC", sans-serif';

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

  const nextY = wrap(result.summary, 458, 560, 500, 38);

  ctx.fillStyle = '#1d1720';
  ctx.font = '700 25px "Manrope", "Noto Sans SC", sans-serif';
  wrap(result.sweetSpot ?? result.vibe, 458, nextY + 20, 500, 34);

  ctx.fillStyle = '#1d1720';
  ctx.font = '700 30px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText('Dimension Snapshot', 96, 874);

  dimensions.slice(0, 4).forEach((dimension, index) => {
    const top = 928 + index * 92;
    ctx.fillStyle = '#1d1720';
    ctx.font = '700 24px "Manrope", "Noto Sans SC", sans-serif';
    ctx.fillText(dimension.title, 120, top);

    ctx.fillStyle = '#6b6571';
    ctx.font = '500 20px "Manrope", "Noto Sans SC", sans-serif';
    ctx.fillText(dimension.leftLabel, 120, top + 30);
    ctx.fillText(dimension.rightLabel, 830, top + 30);

    ctx.fillStyle = '#efe8df';
    ctx.beginPath();
    ctx.roundRect(120, top + 44, 760, 16, 8);
    ctx.fill();

    const normalized = (dimension.score + 100) / 200;
    ctx.fillStyle = category.theme.accent;
    ctx.beginPath();
    ctx.roundRect(120, top + 44, 760 * normalized, 16, 8);
    ctx.fill();
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
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(720, height - 326, 232, 232, 28);
  ctx.fill();
  ctx.drawImage(qr, 746, height - 300, 180, 180);

  ctx.fillStyle = '#1d1720';
  ctx.font = '700 24px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText('Scan To Retake', 742, height - 86);
  ctx.fillStyle = '#6b6571';
  ctx.font = '500 20px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText('AnyTI · Channel first, test second', 96, height - 90);

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
