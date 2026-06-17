# CLAUDE.md – MdReader

## Descripción del proyecto

MdReader es un editor de texto para Windows inspirado en el Bloc de Notas, con soporte para Markdown. Minimalista, intuitivo y rápido.

- **Repositorio:** https://github.com/putxifonti/MdReader
- **Stack:** Electron + React + Vite
- **Editor de texto:** CodeMirror 6
- **Renderizado Markdown:** `marked` + `DOMPurify`

---

## Reglas de trabajo

- Seguir el plan de fases definido en `PLAN.md`. No saltarse fases.
- Al finalizar cada fase: commit con el mensaje indicado en el plan + push a `origin main`.
- No generar ejecutable ni build de producción hasta que el usuario lo pida explícitamente.
- **Si hay dudas sobre el comportamiento esperado, preguntar antes de implementar. Nunca asumir.**
- No añadir dependencias innecesarias. Priorizar librerías ligeras y mantenidas.
- Comentarios en el código: mínimos, solo donde aporten valor real.
- **Todo el programa (UI, botones, menús, textos de la interfaz, nombres de variables, comentarios en código) en inglés.**
- Los ficheros de instrucciones para la IA (`CLAUDE.md`, `PLAN.md`) están en castellano.

---

## Arquitectura general

```
mdreader/
├── electron/
│   ├── main.js          # Main Electron process
│   └── preload.js       # Secure IPC bridge between Electron and React
├── src/
│   ├── App.jsx          # Root component, manages tabs and global state
│   ├── components/
│   │   ├── Toolbar.jsx      # Full toolbar (menus + format + zoom + settings)
│   │   ├── TabBar.jsx       # Tab bar
│   │   ├── Editor.jsx       # CodeMirror 6 wrapper
│   │   ├── Preview.jsx      # Markdown preview panel
│   │   ├── Footer.jsx       # Line/column, char count, credit
│   │   ├── FindReplace.jsx  # Search/replace bar
│   │   └── Settings.jsx     # Settings panel
│   ├── hooks/
│   │   ├── useTabs.js       # Tab management logic
│   │   └── useSettings.js   # Persistent settings logic
│   └── main.jsx         # React entry point
├── PLAN.md
├── CLAUDE.md
├── package.json
└── vite.config.js
```

---

## Estado global (App.jsx)

El estado principal vive en `App.jsx` y se pasa por props o context:

```js
{
  tabs: [
    {
      id: string,           // Unique UUID
      title: string,        // File name or "Untitled"
      content: string,      // Current editor content
      savedContent: string, // Last saved content (to detect unsaved changes)
      filePath: string|null,// Absolute path on disk, null if new
      fileType: 'txt'|'md'  // File type
    }
  ],
  activeTabId: string,
  mode: 'edit'|'read',      // Global mode (affects active tab)
  settings: {
    theme: 'light'|'dark'|'system',
    font: string,
    wordWrap: boolean,
    fontSize: number        // px, range 10–32
  }
}
```

---

## Toolbar – estructura visual

```
[File ▾] [Edit ▾]  [👁 Read]  [A-] [A+]  |  [B] [I] [~~] [H1] [H2] [H3] [`] [</>] [🔗] [-] [1.]  |  [⚙]
└── left ───────────────────────────────────────────────────────────────────────────────────────────┘  └─right─┘
```

- Separador visual `|` entre grupos
- Todos los botones con `title` para mostrar tooltip con nombre + shortcut

---

## Menú File

| Action | Shortcut | Behavior |
|---|---|---|
| New Tab | `Ctrl+U` | Adds empty tab "Untitled" |
| New Window | `Ctrl+Shift+N` | Opens new Electron instance |
| Open | `Ctrl+A` | System dialog, filter `.txt` and `.md`. Opens in new tab |
| Save | `Ctrl+G` | If has path → write to disk. If not → behaves like Save As |
| Save As | `Ctrl+Shift+S` | System dialog to choose name and location |
| Close Tab | `Ctrl+W` | If unsaved changes → confirmation dialog. If not → close directly |
| Close Window | `Ctrl+Shift+W` | Closes window. If tabs with unsaved changes → single dialog "There are N unsaved files" |
| Exit | — | Same as Close Window but closes the app completely |

### Unsaved changes dialog
Three buttons: **Save** / **Don't save** / **Cancel**

---

## Menú Edit

| Action | Shortcut | Behavior |
|---|---|---|
| Undo | `Ctrl+Z` | CodeMirror history |
| Cut | `Ctrl+X` | System native |
| Copy | `Ctrl+C` | System native |
| Paste | `Ctrl+V` | System native |
| Delete | `Del` | Deletes current selection |
| Find | `Ctrl+B` | Opens FindReplace bar in search mode |
| Replace | `Ctrl+R` | Opens FindReplace bar in replace mode |
| Select All | `Ctrl+E` | Selects all editor content |

---

## Format buttons (center of toolbar)

Work on `.txt` and `.md`. If text is selected, wraps it. If not, inserts template.

| Button | Selected text | No selection |
|---|---|---|
| Bold | `**selection**` | `**bold text**` (selects "bold text") |
| Italic | `*selection*` | `*italic text*` |
| Strikethrough | `~~selection~~` | `~~strikethrough~~` |
| H1 | `# selection` at line start | `# Heading 1` |
| H2 | `## selection` | `## Heading 2` |
| H3 | `### selection` | `### Heading 3` |
| Inline code | `` `selection` `` | `` `code` `` |
| Code block | ```` ```\nselection\n``` ```` | ```` ```\ncode\n``` ```` |
| Link | `[selection](url)` | `[text](url)` |
| List | Prefix each line with `- ` | `- item` |
| Numbered list | Prefix each line with `1. ` | `1. item` |

Format shortcuts:
- Bold: `Ctrl+Shift+B`
- Italic: `Ctrl+Shift+I`
- Link: `Ctrl+Shift+K`

---

## Edit mode / Read mode

### Toolbar button (left side, after menus)
- Shortcut: `Ctrl+Shift+P`
- Label: "Read" when in edit mode / "Edit" when in read mode
- Eye icon or similar

### Edit mode
- Shows `<Editor />` (CodeMirror)
- All format buttons active

### Read mode
- Hides `<Editor />`, shows `<Preview />`
- `<Preview />` renders content with `marked` + `DOMPurify`
- Format buttons shown but `disabled` with reduced opacity
- Footer stays updated (chars, lines from original text)

### Preview styles (read mode)
- Simple but clean CSS for: `h1–h3`, `strong`, `em`, `del`, `code`, `pre`, `a`, `ul`, `ol`, `table`
- Styles adapt to active light/dark theme

---

## Zoom

- `A-` and `A+` buttons on toolbar (left side, between mode button and format separator)
- Only affect `font-size` of editor area and preview
- Range: 10px – 32px, increment of 2px per click
- Current fontSize is part of `settings` and is persisted

---

## Footer

```
Line 1, Column 1  |  0 characters          MdReader by Tomàs!
└──────── left ────────────────────┘        └──── center/right ──┘
```

- Updates in real time while typing
- In read mode shows data from original text (not rendered HTML)

---

## Settings panel

Opens as side panel or light modal from the `⚙` button (right of toolbar).

### Options

**Theme**
- `Light`
- `Dark`
- `Use system setting` (default, via `prefers-color-scheme`)

**Editor font** (selector with 4 options)
- `Consolas` (default)
- `Segoe UI`
- `Georgia`
- `JetBrains Mono`

**Word wrap** (toggle)
- On: long lines wrap visually
- Off: horizontal scroll

### Persistence
- Save to `localStorage` (renderer process) or JSON file via IPC if needed from main process
- Load settings on app start before mounting components

---

## IPC Electron ↔ React (preload.js)

Expose on `window.electronAPI`:

```js
window.electronAPI = {
  openFile: () => Promise<{path, content, type}|null>,
  saveFile: (path, content) => Promise<boolean>,
  saveFileAs: (content, defaultName) => Promise<{path}|null>,
  openNewWindow: () => void,
  onMenuAction: (callback) => void,
}
```

Use `contextIsolation: true` and `nodeIntegration: false`.

---

## Estética general

- Minimalista: sin decoración innecesaria
- Inspirado en el Bloc de Notas de Windows: simple, directo
- Tema oscuro por defecto si el sistema lo indica, claro si no
- Colores neutros: sin paleta llamativa
- Toolbar compacto, no ocupa mucho espacio vertical
- Tipografía del editor monoespaciada por defecto (Consolas)
- Tipografía del preview proporcional (Segoe UI o similar)

---

## Notas finales

- No generar ningún ejecutable o `dist/` hasta que el usuario lo pida.
- Hacer `git push` a `https://github.com/putxifonti/MdReader` al final de cada fase.
- Si una dependencia no existe o tiene problemas, proponer alternativa antes de instalar.
- **Si hay dudas sobre comportamiento esperado, preguntar. No asumir ni inventar.**

---

## Lecciones aprendidas

_Esta sección se actualiza a lo largo del desarrollo. Recoge correcciones, preferencias y cosas que no se deben repetir._

<!-- Formato: - [Fase N] Descripción de la lección -->

- [Fase 0] El binario de Electron no se descarga automáticamente en algunos entornos Windows. Hay que ejecutar `node node_modules/electron/install.js` manualmente y, si falla, extraer el ZIP de la caché (`%LOCALAPPDATA%\electron\Cache`) con `Expand-Archive` de PowerShell.

- [Fase 0] PowerShell's `Set-Content -Encoding utf8` escribe BOM (U+FEFF) al inicio del fichero. Para `path.txt` de Electron esto rompe la ruta. Usar siempre `[System.IO.File]::WriteAllText(path, content)` para escribir ficheros sin BOM desde PowerShell.

- [Fase 2] `window.confirm()` en Electron rompe el foco del renderer de forma permanente: después de cerrar el diálogo, ni clicando en el editor se recupera el foco. **Nunca usar `window.confirm()` en Electron.** Usar siempre `dialog.showMessageBox()` del proceso principal vía IPC (`ipcMain.handle` + `ipcRenderer.invoke`).

- [Fase 2] Los diálogos nativos de fichero (`showOpenDialog`, `showSaveDialog`) también roban el foco de la ventana. Después de cada `await api.openFile()` o `await api.saveFileAs()` hay que llamar `setTimeout(() => view.focus(), 100)` para restaurarlo.

- [Fase 2] Cuando se abre un fichero reutilizando el tab activo (sin cambiar `tabId`), el `useEffect([tabId])` del Editor no se re-ejecuta y el EditorView no actualiza su contenido aunque el estado de React sí cambie. Solución: exponer `setContent(content)` vía `useImperativeHandle` y llamarlo explícitamente desde `doOpen`.

- [Fase 2] `addTab()` puede retornar el ID del nuevo tab de forma síncrona porque el ID se genera con `crypto.randomUUID()` antes de llamar a `setState`. Las actualizaciones funcionales de React se aplican en secuencia, así que `updateTab(newId, updates)` llamado justo después encuentra el tab recién creado en el estado final del batch.

