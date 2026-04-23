import { PlaceholderPortrait } from '@/components/PlaceholderPortrait';
import { SiteChrome } from '@/components/SiteChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getVisiblePersonalities } from '@/lib/archetypes';
import { getPackBySlug } from '@/lib/content';
import { getPreferredLocale, pickLocale } from '@/lib/locale';
import { getLoveMeta, getLoveFaceImagePath, loveLeaderboard } from '@/lib/lbti-showcase';

export function RankingsPage() {
  const locale = getPreferredLocale();
  const pack = getPackBySlug('lbti');
  if (!pack) return null;
  const visibleTypes = getVisiblePersonalities(pack.personalities);

  return (
    <div className="ref-shell">
      <SiteChrome current="rankings" />
      <main className="ref-page ref-page--sub">
        <section className="ref-centered-hero">
          <h1>{pickLocale({ zh: '🏅 排行榜大全', en: '🏅 Rankings' }, locale)}</h1>
          <p>
            {pickLocale(
              {
                zh: '全站最新提交实时统计，揭露不同恋爱人格的比例。',
                en: 'A live-style ranking preview showing the current share of every love personality.',
              },
              locale,
            )}
          </p>
        </section>

        <section className="ref-rank-table ref-rank-table--page">
          <header className="ref-rank-head">
            <span>{pickLocale({ zh: '排名', en: 'Rank' }, locale)}</span>
            <span>{pickLocale({ zh: '人格类型', en: 'Type' }, locale)}</span>
            <span>{pickLocale({ zh: '占比', en: 'Bar' }, locale)}</span>
            <span>{pickLocale({ zh: '比例', en: 'Share' }, locale)}</span>
          </header>
          {loveLeaderboard.map((entry, index) => {
            const personality = visibleTypes.find((item) => item.id === entry.id);
            const meta = getLoveMeta(entry.id);
            if (!personality) return null;

            return (
              <article className="ref-rank-row ref-rank-row--page" key={entry.id}>
                <span className="ref-rank-row__index">{index + 1}</span>
                <div className="ref-rank-row__type">
                  <div className="ref-rank-row__thumb">
                    <PlaceholderPortrait accent="#d36d4b" soft="#f7dfd4" label={meta?.name ?? personality.name} imagePath={getLoveFaceImagePath(entry.id, 'selfMock')} size="48px" />
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
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
