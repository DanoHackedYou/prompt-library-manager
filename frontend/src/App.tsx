import { useEffect, useMemo, useState } from 'react';
import { PromptCard } from './components/PromptCard';
import { PromptForm } from './components/PromptForm';
import { StatsBar } from './components/StatsBar';
import {
  createPrompt,
  deletePrompt,
  exportPrompts,
  getStats,
  listPrompts,
  updatePrompt,
} from './services/api';
import type { Prompt, PromptPayload, Stats } from './types';

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');

    try {
      const [promptData, statsData] = await Promise.all([
        listPrompts({
          search,
          category,
          favorite: favoritesOnly ? true : null,
        }),
        getStats(),
      ]);

      setPrompts(promptData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refresh();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, category, favoritesOnly]);

  const categories = useMemo(() => ['All', ...(stats?.categories ?? [])], [stats]);

  async function handleSubmit(payload: PromptPayload, id?: number) {
    if (id) {
      await updatePrompt(id, payload);
      setSelectedPrompt(null);
    } else {
      await createPrompt(payload);
    }

    await refresh();
  }

  async function handleDelete(id: number) {
    await deletePrompt(id);
    if (selectedPrompt?.id === id) {
      setSelectedPrompt(null);
    }
    await refresh();
  }

  async function handleToggleFavorite(prompt: Prompt) {
    await updatePrompt(prompt.id, { is_favorite: !prompt.is_favorite });
    await refresh();
  }

  async function handleExport() {
    const data = await exportPrompts();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'prompt-library-export.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">AI Productivity Tool</div>
        <h1>Prompt Library Manager</h1>
        <p>
          Save, search and organize reusable AI prompts with categories, tags,
          favorites and exportable JSON backups.
        </p>
      </section>

      <StatsBar stats={stats} />

      <section className="workspace">
        <aside>
          <PromptForm
            selectedPrompt={selectedPrompt}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedPrompt(null)}
          />
        </aside>

        <section className="library-panel">
          <div className="toolbar">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search prompts, content or tags..."
            />

            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <label className="favorite-filter">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(event) => setFavoritesOnly(event.target.checked)}
              />
              Favorites
            </label>

            <button type="button" onClick={handleExport}>Export</button>
          </div>

          {error && <p className="error">{error}</p>}
          {loading && <p className="muted">Loading prompts...</p>}

          <div className="prompt-list">
            {!loading && prompts.length === 0 && (
              <div className="empty-state">
                <h2>No prompts found</h2>
                <p>Create your first prompt or clear the current filters.</p>
              </div>
            )}

            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={setSelectedPrompt}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
