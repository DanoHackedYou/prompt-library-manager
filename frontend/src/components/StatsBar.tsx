import type { Stats } from '../types';

type StatsBarProps = {
  stats: Stats | null;
};

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="stats-bar">
      <div>
        <span>Total prompts</span>
        <strong>{stats?.total_prompts ?? 0}</strong>
      </div>
      <div>
        <span>Favorites</span>
        <strong>{stats?.favorite_prompts ?? 0}</strong>
      </div>
      <div>
        <span>Categories</span>
        <strong>{stats?.categories.length ?? 0}</strong>
      </div>
      <div>
        <span>Tags</span>
        <strong>{stats?.tags.length ?? 0}</strong>
      </div>
    </section>
  );
}
