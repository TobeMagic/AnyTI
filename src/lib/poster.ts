import QRCode from 'qrcode';
import type { Category, DimensionSummary, Personality, TestPack } from './types';

type PosterContext = {
  category: Category;
  pack: TestPack;
  result: Personality;
  dimensions: DimensionSummary[];
  permalink: string;
  match?: number;
  display?: {
    code?: string;
    name?: string;
    quote?: string;
    badge?: string;
    icon?: string;
    imagePath?: string;
  };
};

type FacePalette = {
  bgStart: string;
  bgEnd: string;
  ribbonStart: string;
  ribbonEnd: string;
  stampBorder: string;
  stampBg: string;
  stampText: string;
  pillBorder: string;
  pillBg: string;
  watermark: string;
  outerGlow: string;
  outerGlowSoft: string;
  portraitFill: string;
  portraitStroke: string;
  portraitAccent: string;
};

function hexToRgba(hex: string, alpha = 1) {
  const normalized = hex.replace('#', '');
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getFacePalette(badge?: string): FacePalette {
  switch (badge) {
    case '自嘲面':
      return {
        bgStart: 'rgba(246, 243, 242, 0.98)',
        bgEnd: 'rgba(233, 227, 223, 0.98)',
        ribbonStart: 'rgba(96, 88, 86, 0.96)',
        ribbonEnd: 'rgba(66, 61, 60, 0.96)',
        stampBorder: 'rgba(88, 80, 78, 0.28)',
        stampBg: 'rgba(255, 255, 255, 0.72)',
        stampText: 'rgba(91, 81, 79, 0.82)',
        pillBorder: 'rgba(123, 110, 108, 0.28)',
        pillBg: 'rgba(255, 255, 255, 0.62)',
        watermark: 'rgba(69, 58, 56, 0.07)',
        outerGlow: 'rgba(219, 208, 203, 0.92)',
        outerGlowSoft: 'rgba(244, 237, 232, 0.88)',
        portraitFill: 'rgba(255, 252, 249, 0.96)',
        portraitStroke: 'rgba(178, 164, 160, 0.74)',
        portraitAccent: 'rgba(111, 97, 92, 0.82)',
      };
    case '动物面':
      return {
        bgStart: 'rgba(248, 243, 235, 0.98)',
        bgEnd: 'rgba(238, 228, 213, 0.98)',
        ribbonStart: 'rgba(168, 125, 83, 0.94)',
        ribbonEnd: 'rgba(139, 105, 76, 0.94)',
        stampBorder: 'rgba(140, 105, 77, 0.28)',
        stampBg: 'rgba(255, 252, 246, 0.76)',
        stampText: 'rgba(112, 85, 63, 0.82)',
        pillBorder: 'rgba(178, 145, 102, 0.26)',
        pillBg: 'rgba(255, 251, 243, 0.62)',
        watermark: 'rgba(122, 87, 56, 0.07)',
        outerGlow: 'rgba(235, 218, 196, 0.92)',
        outerGlowSoft: 'rgba(250, 242, 231, 0.9)',
        portraitFill: 'rgba(255, 251, 243, 0.96)',
        portraitStroke: 'rgba(190, 163, 126, 0.74)',
        portraitAccent: 'rgba(152, 112, 71, 0.84)',
      };
    case '甜心面':
    default:
      return {
        bgStart: 'rgba(255, 248, 249, 0.98)',
        bgEnd: 'rgba(255, 237, 234, 0.98)',
        ribbonStart: 'rgba(224, 142, 160, 0.92)',
        ribbonEnd: 'rgba(204, 117, 141, 0.92)',
        stampBorder: 'rgba(191, 116, 136, 0.28)',
        stampBg: 'rgba(255, 251, 252, 0.78)',
        stampText: 'rgba(169, 98, 119, 0.82)',
        pillBorder: 'rgba(221, 139, 160, 0.26)',
        pillBg: 'rgba(255, 249, 251, 0.64)',
        watermark: 'rgba(173, 100, 121, 0.06)',
        outerGlow: 'rgba(255, 220, 227, 0.94)',
        outerGlowSoft: 'rgba(255, 242, 244, 0.92)',
        portraitFill: 'rgba(255, 250, 251, 0.98)',
        portraitStroke: 'rgba(228, 170, 185, 0.72)',
        portraitAccent: 'rgba(214, 120, 150, 0.82)',
      };
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
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
}

function drawPlaceholderPortrait(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  palette: FacePalette,
  displayCode: string,
  displayIcon: string,
) {
  ctx.save();
  ctx.translate(x, y);

  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, 40);
  ctx.fillStyle = palette.portraitFill;
  ctx.fill();
  ctx.strokeStyle = palette.portraitStroke;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.arc(size * 0.3, size * 0.28, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.72, size * 0.22, size * 0.06, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = hexToRgba('#ffffff', 0.72);
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.18, size * 0.72);
  ctx.quadraticCurveTo(size * 0.44, size * 0.48, size * 0.78, size * 0.44);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.roundRect(size * 0.24, size * 0.34, size * 0.5, size * 0.42, 34);
  ctx.fill();

  ctx.fillStyle = palette.portraitAccent;
  ctx.font = `800 ${Math.round(size * 0.34)}px "Newsreader", "Noto Serif SC", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayIcon || Array.from(displayCode)[0] || 'L', size * 0.5, size * 0.55);

  ctx.restore();
}

async function drawPortraitImage(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  imagePath: string,
) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 40);
      ctx.clip();

      const naturalWidth = img.naturalWidth || img.width;
      const naturalHeight = img.naturalHeight || img.height;
      const scale = Math.min(size / naturalWidth, size / naturalHeight);
      const drawWidth = naturalWidth * scale;
      const drawHeight = naturalHeight * scale;
      const drawX = x + (size - drawWidth) / 2;
      const drawY = y + (size - drawHeight) / 2;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load portrait image: ${imagePath}`));
    img.src = imagePath;
  });
}

export async function buildPosterBlob({
  category,
  pack,
  result,
  dimensions: _dimensions,
  permalink,
  match,
  display,
}: PosterContext) {
  const displayName = display?.name ?? result.name;
  const displayCode = display?.code ?? pack.meta.slug.toUpperCase();
  const displayBadge = display?.badge ?? result.badge;
  const displaySummary = display?.quote ?? result.summary;
  const displayIcon = display?.icon ?? '🫧';
  const palette = getFacePalette(displayBadge);
  const faceIndex = Math.max(1, ['自嘲面', '动物面', '甜心面'].indexOf(displayBadge) + 1);

  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1520;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is unavailable in this browser.');
  }

  ctx.fillStyle = '#fff8f4';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = palette.outerGlow;
  ctx.beginPath();
  ctx.arc(width - 88, 128, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.outerGlowSoft;
  ctx.beginPath();
  ctx.arc(96, height - 70, 250, 0, Math.PI * 2);
  ctx.fill();

  const shellX = 134;
  const shellY = 126;
  const shellW = width - 268;
  const shellH = 1190;

  ctx.save();
  ctx.translate(shellX - 22, shellY + 18);
  ctx.rotate((-2.3 * Math.PI) / 180);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.strokeStyle = 'rgba(221, 211, 202, 0.68)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(0, 0, shellW, shellH, 42);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(shellX + 18, shellY + 18);
  ctx.rotate((1.8 * Math.PI) / 180);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.strokeStyle = 'rgba(221, 211, 202, 0.68)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(0, 0, shellW, shellH, 42);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  const cardX = 146;
  const cardY = 118;
  const cardW = width - 292;
  const cardH = 1190;

  ctx.shadowColor = 'rgba(155, 116, 102, 0.14)';
  ctx.shadowBlur = 54;
  ctx.shadowOffsetY = 26;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 42);
  const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  cardGradient.addColorStop(0, palette.bgStart);
  cardGradient.addColorStop(1, palette.bgEnd);
  ctx.fillStyle = cardGradient;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  const highlightGradient = ctx.createRadialGradient(cardX + cardW * 0.84, cardY + 88, 10, cardX + cardW * 0.84, cardY + 88, 240);
  highlightGradient.addColorStop(0, 'rgba(255,255,255,0.84)');
  highlightGradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlightGradient;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 42);
  ctx.fill();

  ctx.strokeStyle = 'rgba(223, 211, 198, 0.76)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 42);
  ctx.stroke();

  ctx.fillStyle = palette.watermark;
  ctx.font = '700 146px "Newsreader", "Noto Serif SC", serif';
  ctx.save();
  ctx.translate(cardX + 64, cardY + cardH * 0.8);
  ctx.rotate((-90 * Math.PI) / 180);
  ctx.fillText(displayCode, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(cardX - 18, cardY + 50);
  ctx.rotate((-34 * Math.PI) / 180);
  const ribbonGradient = ctx.createLinearGradient(0, 0, 240, 50);
  ribbonGradient.addColorStop(0, palette.ribbonStart);
  ribbonGradient.addColorStop(1, palette.ribbonEnd);
  ctx.fillStyle = ribbonGradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, 234, 46, 20);
  ctx.fill();
  ctx.fillStyle = '#fff8f6';
  ctx.font = '700 18px "Manrope", "Noto Sans SC", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayBadge.toUpperCase(), 44, 24);
  ctx.restore();

  ctx.fillStyle = palette.stampBg;
  ctx.strokeStyle = palette.stampBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardX + cardW - 176, cardY + 28, 126, 38, 20);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = palette.stampText;
  ctx.font = '700 17px "Manrope", "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(typeof match === 'number' ? `MATCH ${match}%` : 'MATCH', cardX + cardW - 113, cardY + 47);

  drawPlaceholderPortrait(ctx, cardX + (cardW - 292) / 2, cardY + 132, 292, palette, displayCode, displayIcon);
  if (display?.imagePath) {
    try {
      await drawPortraitImage(ctx, cardX + (cardW - 292) / 2, cardY + 132, 292, display.imagePath);
    } catch {
      // Fall through to placeholder if image fails to load
    }
  }

  ctx.fillStyle = palette.pillBg;
  ctx.strokeStyle = palette.pillBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardX + (cardW - 164) / 2, cardY + 462, 164, 36, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(110, 95, 98, 0.86)';
  ctx.font = '600 16px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText(`${displayIcon} ${displayBadge}`, cardX + cardW / 2, cardY + 480);

  ctx.fillStyle = '#18131c';
  ctx.font = '500 96px "Newsreader", "Noto Serif SC", serif';
  ctx.fillText(displayCode, cardX + cardW / 2, cardY + 592);

  ctx.font = '500 48px "Newsreader", "Noto Serif SC", serif';
  ctx.fillText(displayName, cardX + cardW / 2, cardY + 660);

  ctx.fillStyle = 'rgba(53, 43, 46, 0.94)';
  ctx.font = '500 32px "Newsreader", "Noto Serif SC", serif';
  const quoteY = wrapText(ctx, displaySummary, cardX + cardW / 2, cardY + 744, 520, 44);

  const footerTop = quoteY + 24;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.56)';
  ctx.beginPath();
  ctx.roundRect(cardX + 160, footerTop, 210, 34, 17);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(cardX + cardW - 370, footerTop, 210, 34, 17);
  ctx.fill();

  ctx.fillStyle = 'rgba(107, 101, 113, 0.92)';
  ctx.font = '600 15px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText('同一角色 · 三种展示', cardX + 265, footerTop + 18);
  ctx.fillText(`第 ${faceIndex} 面 / 3`, cardX + cardW - 265, footerTop + 18);

  ctx.fillStyle = 'rgba(113, 104, 110, 0.82)';
  ctx.font = '500 14px "Manrope", "Noto Sans SC", sans-serif';
  const qrData = await QRCode.toDataURL(permalink, {
    margin: 0,
    width: 180,
    color: {
      dark: '#13202A',
      light: '#0000',
    },
  });
  const qr = new Image();
  qr.src = qrData;
  await qr.decode();

  const qrSize = 126;
  const qrX = cardX + (cardW - qrSize) / 2;
  const qrY = cardY + cardH - qrSize - 74;
  ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);

  const prettyUrl = permalink.replace(/^https?:\/\//, '');
  ctx.fillStyle = 'rgba(113, 104, 110, 0.82)';
  ctx.font = '500 14px "Manrope", "Noto Sans SC", sans-serif';
  ctx.fillText(prettyUrl, cardX + cardW / 2, cardY + cardH - 54);

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
