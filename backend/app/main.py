from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.models import Prompt, PromptCreate, PromptUpdate, Stats
from app.services.database import (
    create_prompt,
    delete_prompt,
    get_prompt,
    get_stats,
    init_database,
    list_prompts,
    seed_examples,
    update_prompt,
)

app = FastAPI(
    title="Prompt Library Manager API",
    description="Manage, search and organize reusable AI prompts.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_database()
    seed_examples()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/prompts", response_model=list[Prompt])
def get_prompts(
    search: str | None = None,
    category: str | None = None,
    favorite: bool | None = Query(default=None),
) -> list[Prompt]:
    return list_prompts(search=search, category=category, favorite=favorite)


@app.post("/api/prompts", response_model=Prompt, status_code=201)
def post_prompt(payload: PromptCreate) -> Prompt:
    return create_prompt(payload)


@app.get("/api/prompts/{prompt_id}", response_model=Prompt)
def read_prompt(prompt_id: int) -> Prompt:
    prompt = get_prompt(prompt_id)
    if prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt


@app.put("/api/prompts/{prompt_id}", response_model=Prompt)
def put_prompt(prompt_id: int, payload: PromptUpdate) -> Prompt:
    prompt = update_prompt(prompt_id, payload)
    if prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt


@app.delete("/api/prompts/{prompt_id}")
def remove_prompt(prompt_id: int) -> dict[str, str]:
    deleted = delete_prompt(prompt_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return {"status": "deleted"}


@app.get("/api/stats", response_model=Stats)
def read_stats() -> Stats:
    return get_stats()


@app.get("/api/export", response_model=list[Prompt])
def export_prompts() -> list[Prompt]:
    return list_prompts()
