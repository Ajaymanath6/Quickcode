# LLM agent (port 4302)

Local FastAPI Vertex proxy. The browser never holds cloud keys.

## Setup (Python 3.10+)

```bash
bash llm-agent/finish-setup-after-apt.sh
# if venv fails on Ubuntu: sudo apt install python3.10-venv python3-pip
cp llm-agent/.env.llm.example llm-agent/.env.llm
# keep VERTEX_MOCK=1 until AWS/GCP are configured
```

Daily AWS INI refresh (Method 2): refresh `~/.aws/credentials` as your org requires, then restart the agent. The agent reads `AWS_SECRET_NAME` from Secrets Manager, expects JSON `{ "credential_json": "{...}" }`, builds `google.auth.aws.Credentials`, and calls Vertex `genai.Client(vertexai=True, project=GCP_PROJECT, location=GCP_LOCATION)`.

## Env table

| Variable | Purpose |
|---|---|
| `VERTEX_MOCK` | `1` = no cloud calls (default) |
| `THEME_CONTEXT_MODE` | `smart` (default), `legacy`, `rag` |
| `GCP_PROJECT` | Vertex project |
| `GCP_LOCATION` | e.g. `us-central1` |
| `AWS_SECRET_NAME` | Secrets Manager secret |
| `AWS_REGION` | AWS region |
| `GEMINI_MODEL` | `gemini-2.5-flash` (do not use retired 2.0 flash ids) |

Never commit `.env.llm`.

## Run with the web app

```bash
npm run dev:with-llm
```

Starts Vite **5173**, publish helper **4301**, LLM agent **4302**. Vite proxies `/canvas`, `/layout`, `/generate-code`, `/health` → 4302 and `/api` → 4301.

Agent-only: `npm run dev:vertex-llm` (requires `.venv`).

RAG reindex (optional): `npm run rag:reindex` after `pip install -r llm-agent/requirements-rag.txt`.

## Endpoints

`GET /health` → `{ "ok": true, "vertex": "mock"|"live" }`

```bash
curl -sS http://127.0.0.1:4302/health
```

Canvas plan:

```bash
curl -sS -X POST http://127.0.0.1:4302/canvas/plan \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"primary button labeled Submit","messages":[]}'
```

Canvas HTML:

```bash
curl -sS -X POST http://127.0.0.1:4302/canvas/generate-html \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"status card","spacing_enforcement":true}'
```

Layout plan / HTML: `POST /layout/plan`, `POST /layout/generate-html`.

Free text: `POST /generate`, `POST /layout/generate`.

Extension bridge (always `{ "code": "..." }`):

```bash
curl -sS -X POST http://127.0.0.1:4302/generate-code \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Product card"}'
```

Single-token unknown names return **404** with published name hints. Duplicate labels return **409**. Catalog files live in `public/blueprints/` (written by the publish helper).

## Theme context

`smart` injects live palette + keyword chunks + token-help (not the whole guide). `legacy` dumps truncated `public/theme-guide.json`. `rag` adds Chroma; retrieval errors fall back to smart/legacy.

## Tailwind JIT caveat

Classes that exist only in runtime HTML strings (canvas HTML creator / published snippets) may not appear in the Vite Tailwind scan until they are also present under `content` paths (for example after publish writes files under `public/` or `src/`).

## Tests

```bash
cd llm-agent && PYTHONPATH=. python3 -m pytest -q
```

Unit tests never call Vertex.
