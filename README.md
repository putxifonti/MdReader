# MdReader

A minimalist Markdown-aware text editor for Windows, inspired by Notepad. Fast, clean, and distraction-free.

---

## Download

| Version | Description |
|---|---|
| [**MdReader-Setup-0.1.0.exe**](https://github.com/putxifonti/MdReader/releases/download/v0.1.0/MdReader-Setup-0.1.0.exe) | Installer — installs MdReader on your PC with a desktop shortcut |
| [**MdReader-0.1.0-portable.exe**](https://github.com/putxifonti/MdReader/releases/download/v0.1.0/MdReader-0.1.0-portable.exe) | Portable — run directly, no installation needed |

> **Note:** Windows may show a SmartScreen warning ("Windows protected your PC") because the app is not signed with a paid certificate. Click **More info → Run anyway** to proceed.

---

## Features

- **Tabs** — open multiple files at once, just like a modern editor
- **Edit & Read modes** — write Markdown in the editor, then switch to a clean rendered preview with one click (`Ctrl+Shift+P`)
- **Markdown formatting toolbar** — buttons for bold, italic, headings, code blocks, links, lists, and more
- **Find & Replace** — search and replace text across the document (`Ctrl+B` / `Ctrl+R`)
- **Zoom** — adjust the editor font size on the fly (`A–` / `A+`)
- **Themes** — Light, Dark, or follow your system setting
- **Font selector** — choose between Consolas, Segoe UI, Georgia, or JetBrains Mono
- **Word wrap** — toggle long-line wrapping on or off
- **Settings persist** — your preferences are saved and restored on every launch

---

## Keyboard Shortcuts

### File
| Action | Shortcut |
|---|---|
| New Tab | `Ctrl+U` |
| New Window | `Ctrl+Shift+N` |
| Open | `Ctrl+A` |
| Save | `Ctrl+G` |
| Save As | `Ctrl+Shift+S` |
| Close Tab | `Ctrl+W` |
| Close Window | `Ctrl+Shift+W` |

### Edit
| Action | Shortcut |
|---|---|
| Undo | `Ctrl+Z` |
| Cut / Copy / Paste | `Ctrl+X` / `Ctrl+C` / `Ctrl+V` |
| Select All | `Ctrl+E` |
| Find | `Ctrl+B` |
| Replace | `Ctrl+R` |

### Format
| Action | Shortcut |
|---|---|
| Bold | `Ctrl+Shift+B` |
| Italic | `Ctrl+Shift+I` |
| Link | `Ctrl+Shift+K` |
| Toggle Read/Edit mode | `Ctrl+Shift+P` |

---

## Stack

- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [CodeMirror 6](https://codemirror.net/) — editor
- [marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/DOMPurify) — Markdown rendering

---

## Development

```bash
git clone https://github.com/putxifonti/MdReader.git
cd MdReader
npm install
npm run dev
```

To build the Windows installer:

```bash
npm run dist
```

Output goes to `dist-electron/`.

---

Made by [Tomàs](https://github.com/putxifonti)
