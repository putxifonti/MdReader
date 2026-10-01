# MdReader

A minimalist text editor for Windows, inspired by Notepad, with built-in Markdown preview. Write plain text or Markdown, keep multiple files open in tabs, and switch between editing and reading without leaving the app.

---

## Download

**[⬇ MdReader-0.1.0-windows.zip](https://github.com/putxifonti/MdReader/releases/download/v0.1.0/MdReader-0.1.0-windows.zip)**

Download and extract the ZIP, then choose how you want to run MdReader:
- **`MdReader Setup 0.1.0.exe`** — Installer. Installs MdReader with a desktop shortcut and Start Menu entry.
- **`MdReader-0.1.0-portable.exe`** — Portable. Run directly without installing.

> **Note:** MdReader is not code-signed, so Windows may show a SmartScreen warning ("Windows protected your PC"). If you trust the download, choose **More info → Run anyway**.

## Getting started

1. Open a `.txt` or `.md` file from **File → Open**, or start writing in an empty tab.
2. Use the formatting toolbar to insert Markdown syntax around selected text or add a template.
3. Press `Ctrl+Shift+P` to switch between **Edit** and **Read** modes.
4. Save with `Ctrl+G`, and use the settings button to adjust your theme, font, and word wrap.

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

Some shortcuts differ from other editors: **Open** uses `Ctrl+A`, **Save** uses `Ctrl+G`, and **Select All** uses `Ctrl+E`.

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

Prerequisites: [Node.js](https://nodejs.org/) with npm, and [Git](https://git-scm.com/). Use Windows to develop and package the Windows app.

```bash
git clone https://github.com/putxifonti/MdReader.git
cd MdReader
npm install
npm run dev
```

`npm run dev` starts the Vite development server and opens the Electron app.

### Build

To build only the renderer:

```bash
npm run build
```

Output goes to `dist/`.

To package the Windows installer and portable executable:

```bash
npm run dist
```

Both executables are written to `dist-electron/`.

---

Made by [Tomàs](https://github.com/putxifonti)
