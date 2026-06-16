import type { Prompt } from '../types';

type PromptCardProps = {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: number) => Promise<void>;
  onToggleFavorite: (prompt: Prompt) => Promise<void>;
};

export function PromptCard({ prompt, onEdit, onDelete, onToggleFavorite }: PromptCardProps) {
  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt.content);
  }

  return (
    <article className="prompt-card">
      <div className="prompt-card-header">
        <div>
          <span className="category-pill">{prompt.category}</span>
          <h3>{prompt.title}</h3>
        </div>

        <button
          type="button"
          className={prompt.is_favorite ? 'favorite active' : 'favorite'}
          onClick={() => onToggleFavorite(prompt)}
          aria-label="Toggle favorite"
        >
          ★
        </button>
      </div>

      <p className="prompt-content">{prompt.content}</p>

      <div className="meta-grid">
        {prompt.model && (
          <span>
            <strong>Model:</strong> {prompt.model}
          </span>
        )}
        {prompt.use_case && (
          <span>
            <strong>Use case:</strong> {prompt.use_case}
          </span>
        )}
      </div>

      <div className="tags">
        {prompt.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <div className="card-actions">
        <button type="button" onClick={copyPrompt}>Copy</button>
        <button type="button" onClick={() => onEdit(prompt)}>Edit</button>
        <button type="button" className="danger" onClick={() => onDelete(prompt.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
