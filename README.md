# Prompt Library Manager

A full-stack app to save, search and organize reusable AI prompts. It is designed as a professional portfolio project focused on productivity, AI workflows and clean full-stack architecture.

## Screenshot

<img width="2836" height="1620" alt="image" src="https://github.com/user-attachments/assets/d4175745-0c6d-4839-acd3-8d898d033a56" />

## Features

- Create, edit and delete prompts.
- Organize prompts by category, tags, model and use case.
- Mark favorite prompts.
- Search by title, content or tags.
- Filter by category and favorites.
- Copy prompt text to clipboard.
- Export prompt library to JSON.
- Local SQLite persistence.
- FastAPI backend.
- React + TypeScript frontend.
- Docker Compose support.
- GitHub Actions CI.

## Tech Stack

### Backend

- Python 3.12
- FastAPI
- Pydantic
- SQLite
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- CSS

### DevOps

- Docker
- Docker Compose
- GitHub Actions

## Project Structure

```txt
prompt-library-manager/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   └── services/
│   │       └── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── styles.css
│   │   └── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

On macOS/Linux:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend URL:

```txt
http://localhost:8000
```

API docs:

```txt
http://localhost:8000/docs
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

## Docker Setup

From the project root:

```bash
docker compose up --build
```

Then open:

```txt
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/api/prompts` | List prompts with filters |
| POST | `/api/prompts` | Create a prompt |
| GET | `/api/prompts/{id}` | Get one prompt |
| PUT | `/api/prompts/{id}` | Update a prompt |
| DELETE | `/api/prompts/{id}` | Delete a prompt |
| GET | `/api/stats` | Prompt library statistics |
| GET | `/api/export` | Export prompts as JSON |

## Roadmap

- Import JSON backup.
- Prompt version history.
- Prompt quality scoring.
- Prompt variables and templates.
- Browser extension integration.
- Authentication.
- Cloud deployment.

## GitHub Topics

Recommended repository topics:

```txt
prompt-library
ai-productivity
fastapi
react
typescript
sqlite
vite
portfolio-project
productivity-tools
```

## Status

MVP complete and ready for portfolio use.

## License

MIT License.
