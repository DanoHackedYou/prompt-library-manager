export type Prompt = {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  model?: string | null;
  use_case?: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type PromptPayload = {
  title: string;
  content: string;
  category: string;
  tags: string[];
  model?: string | null;
  use_case?: string | null;
  is_favorite: boolean;
};

export type Stats = {
  total_prompts: number;
  favorite_prompts: number;
  categories: string[];
  tags: string[];
};
