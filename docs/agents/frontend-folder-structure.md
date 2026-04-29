# Frontend Folder Structure

## Purpose

Use this file to quickly locate code in the `frontend/` app.

## Structure

```text
frontend/
├── AGENT.md
├── docs/
│   ├── AGENT.md
│   ├── DESIGN.md
│   └── agents/
│       ├── frontend-agent.md
│       ├── frontend-folder-structure.md
│       └── shared-agent-context.md
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── README.md
```

## Where To Start By Task

- Route/page issue: `src/App.jsx`, then the relevant page in `src/pages/`
- Auth/session bug: `src/context/AuthContext.jsx`, `src/api/authService.js`, `src/api/axiosClient.js`
- API integration issue: `src/api/index.js` and feature pages/hooks
- Styling issue: matching file under `src/styles/`
- Shared contract issue: `docs/agents/shared-agent-context.md`

## Editing Flow

When changing a feature, usually read in this order:

1. Route page
2. Related components
3. Hook or context
4. API service
5. Matching CSS
6. Shared agent context if the change affects backend expectations
