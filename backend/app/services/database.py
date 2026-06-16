import json
import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.models import PromptCreate, PromptUpdate

DB_PATH = Path(__file__).resolve().parents[2] / "prompt_library.db"


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_database() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS prompts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'General',
                tags TEXT NOT NULL DEFAULT '[]',
                model TEXT,
                use_case TEXT,
                is_favorite INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        connection.commit()


def _row_to_prompt(row: sqlite3.Row) -> Dict[str, Any]:
    data = dict(row)
    data["tags"] = json.loads(data.get("tags") or "[]")
    data["is_favorite"] = bool(data.get("is_favorite"))
    return data


def list_prompts(
    search: Optional[str] = None,
    category: Optional[str] = None,
    favorite: Optional[bool] = None,
) -> List[Dict[str, Any]]:
    query = "SELECT * FROM prompts WHERE 1=1"
    params: List[Any] = []

    if search:
        query += " AND (LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(tags) LIKE ?)"
        value = f"%{search.lower()}%"
        params.extend([value, value, value])

    if category and category != "All":
        query += " AND category = ?"
        params.append(category)

    if favorite is not None:
        query += " AND is_favorite = ?"
        params.append(1 if favorite else 0)

    query += " ORDER BY updated_at DESC, id DESC"

    with get_connection() as connection:
        rows = connection.execute(query, params).fetchall()
        return [_row_to_prompt(row) for row in rows]


def get_prompt(prompt_id: int) -> Optional[Dict[str, Any]]:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM prompts WHERE id = ?",
            (prompt_id,),
        ).fetchone()
        return _row_to_prompt(row) if row else None


def create_prompt(payload: PromptCreate) -> Dict[str, Any]:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO prompts (title, content, category, tags, model, use_case, is_favorite)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.title,
                payload.content,
                payload.category or "General",
                json.dumps(payload.tags),
                payload.model,
                payload.use_case,
                1 if payload.is_favorite else 0,
            ),
        )
        connection.commit()
        created = get_prompt(cursor.lastrowid)
        if created is None:
            raise RuntimeError("Prompt could not be created")
        return created


def update_prompt(prompt_id: int, payload: PromptUpdate) -> Optional[Dict[str, Any]]:
    current = get_prompt(prompt_id)
    if current is None:
        return None

    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        return current

    columns = []
    values: List[Any] = []

    for key, value in updates.items():
        columns.append(f"{key} = ?")
        if key == "tags":
            values.append(json.dumps(value or []))
        elif key == "is_favorite":
            values.append(1 if value else 0)
        else:
            values.append(value)

    columns.append("updated_at = CURRENT_TIMESTAMP")
    values.append(prompt_id)

    with get_connection() as connection:
        connection.execute(
            f"UPDATE prompts SET {', '.join(columns)} WHERE id = ?",
            values,
        )
        connection.commit()

    return get_prompt(prompt_id)


def delete_prompt(prompt_id: int) -> bool:
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM prompts WHERE id = ?", (prompt_id,))
        connection.commit()
        return cursor.rowcount > 0


def get_stats() -> Dict[str, Any]:
    prompts = list_prompts()
    categories = sorted({prompt["category"] for prompt in prompts if prompt.get("category")})
    tags = sorted({tag for prompt in prompts for tag in prompt.get("tags", [])})

    return {
        "total_prompts": len(prompts),
        "favorite_prompts": sum(1 for prompt in prompts if prompt.get("is_favorite")),
        "categories": categories,
        "tags": tags,
    }


def seed_examples() -> None:
    with get_connection() as connection:
        count = connection.execute("SELECT COUNT(*) FROM prompts").fetchone()[0]

    if count:
        return

    examples = [
        PromptCreate(
            title="Explain code like a senior mentor",
            content="Act as a senior software mentor. Review the following code, explain what it does, identify risks, and suggest improvements with examples.",
            category="Development",
            tags=["code-review", "mentoring", "software"],
            model="GPT-4 / Claude / Gemini",
            use_case="Code understanding",
            is_favorite=True,
        ),
        PromptCreate(
            title="Turn notes into a professional report",
            content="Transform these rough notes into a clear professional report with sections, concise language and actionable conclusions.",
            category="Writing",
            tags=["report", "productivity"],
            model="Any LLM",
            use_case="Documentation",
        ),
        PromptCreate(
            title="Generate test cases",
            content="Create unit test cases for this function. Include normal cases, edge cases, invalid inputs and expected outputs.",
            category="Development",
            tags=["testing", "quality"],
            model="GPT-4 / Claude / Gemini",
            use_case="Testing",
        ),
    ]

    for example in examples:
        create_prompt(example)
