from pydantic import BaseModel, Field
from typing import List, Optional


class PromptBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    content: str = Field(..., min_length=5)
    category: str = Field(default="General", max_length=60)
    tags: List[str] = Field(default_factory=list)
    model: Optional[str] = Field(default=None, max_length=80)
    use_case: Optional[str] = Field(default=None, max_length=120)
    is_favorite: bool = False


class PromptCreate(PromptBase):
    pass


class PromptUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=120)
    content: Optional[str] = Field(default=None, min_length=5)
    category: Optional[str] = Field(default=None, max_length=60)
    tags: Optional[List[str]] = None
    model: Optional[str] = Field(default=None, max_length=80)
    use_case: Optional[str] = Field(default=None, max_length=120)
    is_favorite: Optional[bool] = None


class Prompt(PromptBase):
    id: int
    created_at: str
    updated_at: str


class Stats(BaseModel):
    total_prompts: int
    favorite_prompts: int
    categories: List[str]
    tags: List[str]
