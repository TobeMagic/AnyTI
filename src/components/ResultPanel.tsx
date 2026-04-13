import { useState } from 'react';
import { buildPosterBlob } from '@/lib/poster';
import type { Category, DimensionSummary, Personality, TestPack } from '@/lib/types';
import { PlaceholderPortrait } from './PlaceholderPortrait';

type ResultPanelProps = {
  category: Category;
  pack: TestPack;
  result: Personality;
  dimensions: DimensionSummary[];
  permalink: string;
  onRestart: () => void;
};

export function ResultPanel({
  category,
  pack,
  result,
  dimensions,
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
        <div>
          <p className="eyebrow">{pack.meta.accentLabel}</p>
          <h2 className="result-panel__name" data-testid="result-name">
            {result.name}
          </h2>
          <p className="result-panel__badge">{result.badge}</p>
          <p className="result-panel__vibe">{result.vibe}</p>
        </div>
        <PlaceholderPortrait
          accent={category.theme.accent}
          soft={category.theme.accentSoft}
          label={result.name}
        />
      </div>

      <div className="result-grid">
        <article className="result-card">
          <h3>这一型为什么像你</h3>
          <p>{result.summary}</p>
          <p className="result-card__note">{result.whyItHits}</p>
        </article>
        <article className="result-card">
          <h3>结果标签怎么读</h3>
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

      <article className="result-card result-card--muted">
        <h3>这个测试怎么读</h3>
        <p>
          这不是心理诊断，只是把你最近的关系或工作状态，压缩成一张更好懂、更好发的
          标签卡。它参考连续维度匹配，不走二选一的人格神谕。
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
