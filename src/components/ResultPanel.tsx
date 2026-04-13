import { useState } from 'react';
import { buildPosterBlob } from '@/lib/poster';
import type { Category, DimensionSummary, RankedResult, Personality, TestPack } from '@/lib/types';
import { PlaceholderPortrait } from './PlaceholderPortrait';

type ResultPanelProps = {
  category: Category;
  pack: TestPack;
  result: Personality;
  dimensions: DimensionSummary[];
  match: number;
  nearby: RankedResult[];
  permalink: string;
  onRestart: () => void;
};

export function ResultPanel({
  category,
  pack,
  result,
  dimensions,
  match,
  nearby,
  permalink,
  onRestart,
}: ResultPanelProps) {
  const [status, setStatus] = useState<string>('');

  async function handlePosterDownload() {
    try {
      setStatus('正在生成海报…');
      const blob = await buildPosterBlob({
        category,
        pack,
        result,
        dimensions,
        permalink,
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${pack.meta.slug}-${result.slug}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus('海报已准备好，浏览器已开始下载。');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '海报导出失败。');
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(permalink);
      setStatus('链接已复制，直接发群就行。');
    } catch {
      setStatus('复制失败，请手动复制当前地址。');
    }
  }

  return (
    <section className="result-panel" data-testid="result-panel">
      <div className="result-panel__hero">
        <div className="result-panel__copy">
          <div className="chip-row chip-row--result">
            <span className="metric-chip">{pack.meta.accentLabel}</span>
            <span className="metric-chip">{pack.meta.slug.toUpperCase()}</span>
            <span className="metric-chip">匹配 {match}%</span>
          </div>
          <p className="eyebrow">{result.group ?? '恋爱类型'}</p>
          <h2 className="result-panel__name" data-testid="result-name">
            {result.name}
          </h2>
          <p className="result-panel__badge">{result.badge}</p>
          <p className="result-panel__vibe">{result.vibe}</p>
        </div>
        <div className="result-panel__figure">
          <PlaceholderPortrait
            accent={category.theme.accent}
            soft={category.theme.accentSoft}
            label={result.name}
          />
        </div>
      </div>

      {result.sweetSpot || result.stressSignal || result.repairTip ? (
        <div className="story-band story-band--result">
          {result.sweetSpot ? (
            <article className="story-band__item">
              <small>你最有魅力的点</small>
              <p>{result.sweetSpot}</p>
            </article>
          ) : null}
          {result.stressSignal ? (
            <article className="story-band__item">
              <small>压力下会怎样</small>
              <p>{result.stressSignal}</p>
            </article>
          ) : null}
          {result.repairTip ? (
            <article className="story-band__item">
              <small>更适合你的修复方式</small>
              <p>{result.repairTip}</p>
            </article>
          ) : null}
        </div>
      ) : null}

      <div className="result-grid">
        <article className="result-card">
          <h3>这一型为什么会命中你</h3>
          <p>{result.summary}</p>
          <p className="result-card__note">{result.whyItHits}</p>
        </article>
        <article className="result-card">
          <h3>这张标签该怎么读</h3>
          <ul className="bullet-list">
            {result.dimensionRead.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="result-card">
        <h3>你的维度热区</h3>
        <div className="meter-stack">
          {dimensions.map((dimension) => {
            const fillWidth = `${(dimension.score + 100) / 2}%`;
            return (
              <div key={dimension.key} className="meter-row">
                <div className="meter-row__labels">
                  <strong>{dimension.title}</strong>
                  <span>
                    {dimension.score >= 0 ? dimension.rightLabel : dimension.leftLabel}
                  </span>
                </div>
                <div className="meter-row__track" aria-hidden="true">
                  <span className="meter-row__mid" />
                  <span className="meter-row__fill" style={{ width: fillWidth }} />
                </div>
                <div className="meter-row__ends">
                  <span>{dimension.leftLabel}</span>
                  <span>{dimension.rightLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      {nearby.length ? (
        <article className="result-card">
          <h3>和你很接近的另外几型</h3>
          <div className="nearby-strip">
            {nearby.slice(0, 3).map((entry) => (
              <div className="nearby-strip__item" key={entry.personality.id}>
                <strong>{entry.personality.name}</strong>
                <span>{entry.personality.badge}</span>
                <small>匹配 {entry.match}%</small>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      <article className="result-card result-card--muted">
        <h3>这个测试怎么读</h3>
        <p>
          这不是心理诊断，只是把你最近的关系状态压缩成一张更好懂、更好发的标签卡。
          它用的是连续模型和相似度匹配，不是二选一的人格神谕。
        </p>
      </article>

      <div className="result-actions">
        <button className="primary-button" onClick={handlePosterDownload} type="button">
          保存结果海报
        </button>
        <button className="ghost-button" onClick={handleCopyLink} type="button">
          复制结果链接
        </button>
        <button className="ghost-button" onClick={onRestart} type="button">
          重新测一次
        </button>
      </div>
      {status ? <p className="result-status">{status}</p> : null}
    </section>
  );
}
