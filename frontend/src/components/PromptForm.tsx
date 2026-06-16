import { useEffect, useState } from 'react';
import type { Prompt, PromptPayload } from '../types';

type PromptFormProps = {
  selectedPrompt: Prompt | null;
  onSubmit: (payload: PromptPayload, id?: number) => Promise<void>;
  onCancel: () => void;
};

const emptyForm: PromptPayload = {
  title: '',
  content: '',
  category: 'General',
  tags: [],
  model: '',
  use_case: '',
  is_favorite: false,
};

export function PromptForm({ selectedPrompt, onSubmit, onCancel }: PromptFormProps) {
  const [form, setForm] = useState<PromptPayload>(emptyForm);
  const [tagsText, setTagsText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedPrompt) {
      setForm({
        title: selectedPrompt.title,
        content: selectedPrompt.content,
        category: selectedPrompt.category,
        tags: selectedPrompt.tags,
        model: selectedPrompt.model ?? '',
        use_case: selectedPrompt.use_case ?? '',
        is_favorite: selectedPrompt.is_favorite,
      });
      setTagsText(selectedPrompt.tags.join(', '));
    } else {
      setForm(emptyForm);
      setTagsText('');
    }
  }, [selectedPrompt]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    await onSubmit({ ...form, tags }, selectedPrompt?.id);
    setSubmitting(false);

    if (!selectedPrompt) {
      setForm(emptyForm);
      setTagsText('');
    }
  }

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <span className="eyebrow">Prompt editor</span>
          <h2>{selectedPrompt ? 'Edit prompt' : 'Create prompt'}</h2>
        </div>
        {selectedPrompt && (
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <label>
        Title
        <input
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          placeholder="e.g. Refactor this function"
          required
        />
      </label>

      <label>
        Prompt content
        <textarea
          value={form.content}
          onChange={(event) => setForm({ ...form, content: event.target.value })}
          placeholder="Write your reusable prompt here..."
          required
        />
      </label>

      <div className="form-grid">
        <label>
          Category
          <input
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            placeholder="Development"
          />
        </label>

        <label>
          Tags
          <input
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            placeholder="code, testing, writing"
          />
        </label>
      </div>

      <div className="form-grid">
        <label>
          Recommended model
          <input
            value={form.model ?? ''}
            onChange={(event) => setForm({ ...form, model: event.target.value })}
            placeholder="GPT-4, Claude, Gemini..."
          />
        </label>

        <label>
          Use case
          <input
            value={form.use_case ?? ''}
            onChange={(event) => setForm({ ...form, use_case: event.target.value })}
            placeholder="Documentation, coding, studying..."
          />
        </label>
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.is_favorite}
          onChange={(event) => setForm({ ...form, is_favorite: event.target.checked })}
        />
        Mark as favorite
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : selectedPrompt ? 'Update prompt' : 'Save prompt'}
      </button>
    </form>
  );
}
