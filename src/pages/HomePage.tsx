import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { AuthorWechatLink } from '@/components/AuthorWechatLink';
import { PlaceholderPortrait } from '@/components/PlaceholderPortrait';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { addImagePreloadLinks, scheduleImagePreload } from '@/lib/image-preload';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getAboutHref, getRankingsHref, getStartTestHref, getTypesHref } from '@/lib/routes';
import {
  getAdjacentLoveFace,
  getLoveFace,
  getLoveFaceThumbPath,
  getLoveMeta,
  loveLeaderboard,
  loveOfficialNotes,
} from '@/lib/lbti-showcase';

export function HomePage() {
  const locale = getPreferredLocale();
  const pack = getPackBySlug('lbti');
  const [activeFace, setActiveFace] = useState<'selfMock' | 'animal' | 'sweet'>('selfMock');

  const visibleTypes = pack ? getVisiblePersonalities(pack.personalities) : [];
  const sourceMap = new Map((pack?.meta.methodology.sources ?? []).map((source) => [source.id, source]));
  const sources = pack?.meta.methodology.sources ?? [];
  const displayTypes = [...visibleTypes].sort((left, right) => {
    const leftHeat = getLoveMeta(left.id)?.heat ?? 999;
    const rightHeat = getLoveMeta(right.id)?.heat ?? 999;
    return leftHeat - rightHeat;
  });
  const matrixImageUrls = displayTypes.flatMap((personality) =>
    (['selfMock', 'animal', 'sweet'] as const).map((faceKey) => getLoveFaceThumbPath(personality.id, faceKey)),
  );
  const matrixImagePreloadKey = matrixImageUrls.filter(Boolean).join('|');

  useEffect(() => {
    const removeLinks = addImagePreloadLinks(matrixImageUrls, { fetchPriority: 'high' });
    const cancelWarmup = scheduleImagePreload(matrixImageUrls, { fetchPriority: 'high' });

    return () => {
      removeLinks?.();
      cancelWarmup?.();
    };
  }, [matrixImagePreloadKey]);

  if (!pack) return null;

  return (
    <div className="ref-shell">
      <SiteChrome current="home" />
      <main className="ref-page ref-page--home">
        <section className="cbti-home cbti-home--embedded">
          <div className="cbti-home__hero">
            <div className="cbti-home__matrix" data-testid="home-type-wall" key={activeFace}>
              {displayTypes.map((personality, index) => {
                const face = getLoveFace(personality.id, activeFace);
                return (
                  <button
                    className={`cbti-home__matrix-card cbti-home__matrix-card--${activeFace}`}
                    key={personality.id}
                    onClick={() => setActiveFace((previous) => getAdjacentLoveFace(previous, 'next'))}
                    style={{ '--flip-delay': `${index * 18}ms` } as CSSProperties}
                    type="button"
                  >
                    <div className="cbti-home__matrix-media">
                      <PlaceholderPortrait
                        accent="#d36d4b"
                        soft="#f7dfd4"
                        label={face?.name ?? personality.name}
                        imageFetchPriority={index < 8 ? 'high' : 'auto'}
                        imageLoading="eager"
                        imagePath={getLoveFaceThumbPath(personality.id, activeFace)}
                        size="44px"
                      />
                    </div>
                    <strong>{face?.code ?? 'LBTI'}</strong>
                    <b>{face?.name ?? personality.name}</b>
                  </button>
                );
              })}
            </div>
            <p className="cbti-home__flip-hint">
              {pickLocale(
                {
                  zh: '👆 点击任意角色，切换自嘲面 / 动物面 / 甜心面',
                  en: '👆 Tap any role to switch between the three faces',
                },
                locale,
              )}
            </p>

            <p className="cbti-home__meta">
              {pickLocale(
                {
                  zh: `🧪 ${pack.meta.questionCount}道题 · ${pack.meta.durationLabel} · ${visibleTypes.length}种恋爱人格`,
                  en: `🧪 ${pack.meta.questionCount} questions · ${pack.meta.durationLabel} · ${visibleTypes.length} love types`,
                },
                locale,
              )}
            </p>

            <h1 className="cbti-home__title">
              <span>{pickLocale({ zh: 'MBTI测不出你', en: 'MBTI will not tell you' }, locale)}</span>
              <span className="is-accent">
                {pickLocale({ zh: '为什么总在恋爱里内耗', en: 'why you keep overthinking in love' }, locale)}
              </span>
              <span>{pickLocale({ zh: '但这套可以。', en: 'but this one can.' }, locale)}</span>
            </h1>

            <p className="cbti-home__lede">
              {pickLocale(
                {
                  zh: '用六个亲密关系维度，测出你在回应、边界、修复、承诺和撤离里的默认恋爱模式。',
                  en: 'A six-dimension relationship test for your default pattern in intimacy, repair, boundaries, commitment, and retreat.',
                },
                locale,
              )}
            </p>

            <div className="cbti-home__actions">
              <a className="cbti-home__start" data-testid="hero-start" href={getStartTestHref()}>
                {pickLocale({ zh: '开始测试 →', en: 'Start Test →' }, locale)}
              </a>
            </div>

            <p className="cbti-home__count">
              {pickLocale(
                {
                  zh: `当前版本已开放 ${visibleTypes.length} 种人格档案`,
                  en: `${visibleTypes.length} public profiles are available in this version`,
                },
                locale,
              )}
            </p>

            <div className="cbti-home__links">
              <a href={getTypesHref()}>{pickLocale({ zh: '人格图鉴', en: 'Types' }, locale)}</a>
              <a href={getAboutHref()}>{pickLocale({ zh: '关于测试', en: 'About' }, locale)}</a>
            </div>

            <p className="cbti-home__author">
              <span>{pickLocale({ zh: '作者（公众号）：', en: 'Author (WeChat): ' }, locale)}</span>
              <AuthorWechatLink />
            </p>
          </div>
        </section>

        <section className="ref-section">
          <div className="ref-section__head">
            <div>
              <h2>{pickLocale({ zh: '🪞 情侣互动的 6 个核心机制', en: '🪞 Six Core Relationship Mechanisms' }, locale)}</h2>
              <p className="ref-section__lede">
                {pickLocale(
                  {
                    zh: '不是只看谁先回消息，而是覆盖情侣关系里最常见的回应、安全感、修复、边界、承诺与撤离。',
                    en: 'This model covers responsiveness, repair, autonomy, commitment, and withdrawal rather than just surface behavior.',
                  },
                  locale,
                )}
              </p>
            </div>
          </div>
          <div className="ref-model-grid">
            {pack.meta.dimensionDetails.map((detail) => (
              <article className="ref-model-card" key={detail.key}>
                {detail.scienceTag ? <small className="ref-model-card__tag">{detail.scienceTag}</small> : null}
                <h3>{detail.title}</h3>
                <p>
                  {detail.leftLabel} <span>/</span> {detail.rightLabel}
                </p>
                {detail.coverage ? <span className="ref-model-card__note">📌 {detail.coverage}</span> : null}
                {detail.sourceIds?.length ? (
                  <div className="ref-card-links">
                    {detail.sourceIds
                      .map((sourceId) => sourceMap.get(sourceId))
                      .filter((source): source is NonNullable<typeof source> => Boolean(source))
                      .map((source) => (
                        <a
                          className="ref-card-link"
                          href={source.url}
                          key={source.id}
                          rel="noreferrer"
                          target="_blank"
                        >
                          🔗 {source.publisher}
                        </a>
                      ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {sources.length ? (
          <section className="ref-section ref-section--tight" data-testid="home-references" id="research">
            <div className="ref-section__head ref-section__head--split">
              <div>
                <h2>{pickLocale({ zh: '🔬 学术依据与参考文献', en: '🔬 Research Basis & References' }, locale)}</h2>
                <p className="ref-section__lede">
                  {pickLocale(
                    {
                      zh: 'LBTI 的六维和场景题不是空口整活。下面直接列出它依赖的关系科学来源、学术依据和参考文献。',
                      en: 'The LBTI dimensions are grounded in recurring findings from relationship science.',
                    },
                    locale,
                  )}
                </p>
              </div>
              <a className="ref-link" href={getAboutHref()}>
                {pickLocale({ zh: '查看全部来源 →', en: 'View All Sources →' }, locale)}
              </a>
            </div>
            <div className="ref-source-list">
              {sources.slice(0, 4).map((source, index) => (
                <article className="ref-source-card" key={source.id}>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <div>
                    <strong>{source.title}</strong>
                    {source.citation ? <span className="ref-source-card__citation">📚 {source.citation}</span> : null}
                    <p>{source.takeaway}</p>
                    <div className="ref-card-links">
                      <a className="ref-card-link" href={source.url} rel="noreferrer" target="_blank">
                        🔗 {source.publisher}
                      </a>
                      <span className="ref-source-card__topics">🧬 {source.appliesTo.join(' / ')}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="ref-section">
          <div className="ref-section__head ref-section__head--split">
            <div>
              <h2>{pickLocale({ zh: '🏆 真实提交排行榜', en: '🏆 Real Submission Rankings' }, locale)}</h2>
            </div>
            <a className="ref-link" href={getRankingsHref()}>
              {pickLocale({ zh: '查看完整排行榜 →', en: 'View Full Rankings →' }, locale)}
            </a>
          </div>
          <div className="ref-rank-table">
            {loveLeaderboard.slice(0, 5).map((entry, index) => {
              const personality = visibleTypes.find((item) => item.id === entry.id);
              const meta = getLoveMeta(entry.id);
              if (!personality) return null;

              return (
                <article className="ref-rank-row" key={entry.id}>
                  <span className="ref-rank-row__index">{index + 1}</span>
                  <div className="ref-rank-row__type">
                    <div className="ref-rank-row__thumb">
                      <PlaceholderPortrait
                        accent="#d36d4b"
                        imageFetchPriority={index < 3 ? 'high' : 'auto'}
                        imageLoading="eager"
                        imagePath={getLoveFaceThumbPath(entry.id, 'selfMock')}
                        label={meta?.name ?? personality.name}
                        size="48px"
                        soft="#f7dfd4"
                      />
                    </div>
                    <div>
                      <strong>{meta?.emoji} {meta?.code}</strong>
                      <b>{meta?.emoji} {meta?.name ?? personality.name}</b>
                      <p>💬 {meta?.preview ?? personality.badge}</p>
                    </div>
                  </div>
                  <div className="ref-rank-row__bar">
                    <span style={{ width: entry.share }} />
                  </div>
                  <em>{entry.share}</em>
                </article>
              );
            })}
          </div>
        </section>

        <section className="ref-section">
          <div className="ref-section__head">
            <h2>📜 官方说明</h2>
          </div>
          <div className="ref-note-list">
            {loveOfficialNotes.map((item) => (
              <article className="ref-note-card" key={item.title}>
                <small>{item.eyebrow}</small>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
