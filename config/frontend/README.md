This folder contains frontend-specific TypeScript configuration used for IDEs and the
frontend codebase.

Quick notes
- The file `config/frontend/tsconfig.json` is intended for editor/tsserver usage
  (for example, to point VS Code at the frontend sources and enable fast type checks).
- To run a one-off type-check from the repository root:

```powershell
npx tsc -p ./config/frontend/tsconfig.json --noEmit
```

Editor setup
- In VS Code select the workspace TypeScript version (Command Palette → TypeScript: Select TypeScript Version → Use Workspace Version).

If you hit peer-dependency issues while installing dev tooling, consider using Node >= 20 or consult the repo README about the current workaround (`--legacy-peer-deps`).
