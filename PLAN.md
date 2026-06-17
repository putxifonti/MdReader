# MdReader – Plan de Desarrollo

Repositorio: https://github.com/putxifonti/MdReader  
Stack: Electron + React + Vite  
Filosofía: minimalista, intuitivo, similar al Bloc de Notas de Windows

---

## Normas de trabajo

- Cada fase se implementa entera antes de pasar a la siguiente.
- Al final de cada fase, el usuario prueba la app. Si todo funciona → commit + push a GitHub → siguiente fase.
- Ninguna fase empieza sin que la anterior esté aprobada.
- Mensaje de commit estándar: `feat: [nombre de la fase]`
- **Si hay dudas sobre comportamiento esperado, preguntar antes de implementar.**
- Todo el programa (UI, botones, menús, textos, código) en inglés.

---

## Fase 0 – Esqueleto del proyecto

**Objetivo:** Tener la app arrancando, vacía pero funcional, subida al repo.

- Inicializar proyecto Electron + React + Vite
- Configurar `electron-builder` para generar ejecutable Windows
- Ventana principal con tamaño mínimo razonable
- `.gitignore` adecuado para Node + Electron
- `README.md` básico
- Inicializar git y subir todo al repositorio `putxifonti/MdReader`

**Prueba:** La app abre una ventana vacía sin errores en consola.  
**Commit:** `feat: project scaffold`

---

## Fase 1 – Editor de texto base + pestañas

**Objetivo:** Poder escribir texto en pestañas, igual que el Bloc de Notas pero con pestañas.

- Área de texto editable (CodeMirror 6) que ocupa toda la ventana
- Sistema de pestañas en la parte superior:
  - Cada pestaña muestra el nombre del fichero (o "Untitled" si es nuevo)
  - Botón para cerrar pestaña individual (icono ×)
  - Indicador visual si hay cambios no guardados (punto • junto al nombre)
- Diálogo de confirmación "Do you want to save changes?" al cerrar pestaña con cambios
- Shortcuts básicos funcionales: `Ctrl+Z` (deshacer), `Ctrl+X/C/V` (cortar/copiar/pegar)
- Footer visible:
  - Izquierda: `Line X, Column Y  |  Z characters`
  - Centro/derecha: `MdReader by Tomàs!`

**Prueba:** Abrir varias pestañas, escribir, cerrar con y sin cambios, verificar footer.  
**Commit:** `feat: base editor with tabs and footer`

---

## Fase 2 – Toolbar: menús File y Edit

**Objetivo:** Menú completo funcional a la izquierda del toolbar, con todas las acciones y shortcuts.

### Menú File
| Acción | Shortcut |
|---|---|
| New Tab | `Ctrl+U` |
| New Window | `Ctrl+Shift+N` |
| Open | `Ctrl+A` |
| Save | `Ctrl+G` |
| Save As | `Ctrl+Shift+S` |
| Close Tab | `Ctrl+W` |
| Close Window | `Ctrl+Shift+W` |
| Exit | — |

### Menú Edit
| Acción | Shortcut |
|---|---|
| Undo | `Ctrl+Z` |
| Cut | `Ctrl+X` |
| Copy | `Ctrl+C` |
| Paste | `Ctrl+V` |
| Delete | `Del` |
| Find | `Ctrl+B` |
| Replace | `Ctrl+R` |
| Select All | `Ctrl+E` |

- Diálogo Find/Replace integrado en el editor (barra que aparece debajo del toolbar)
- Abrir fichero lee `.txt` y `.md` correctamente (UTF-8)
- Guardar escribe el fichero en disco
- Save As abre diálogo del sistema para elegir ubicación

**Prueba:** Probar todas las acciones y shortcuts, abrir y guardar ficheros reales.  
**Commit:** `feat: toolbar menus File and Edit`

---

## Fase 3 – Toolbar: formato de texto + zoom

**Objetivo:** Botones de formato en el centro del toolbar y controles de zoom.

### Botones de formato (centro del toolbar)
Insertan sintaxis Markdown en el cursor, funcionan en `.txt` y `.md`:

| Botón | Sintaxis insertada | Shortcut |
|---|---|---|
| **B** Bold | `**text**` | `Ctrl+Shift+B` |
| *I* Italic | `*text*` | `Ctrl+Shift+I` |
| ~~S~~ Strikethrough | `~~text~~` | — |
| H1 | `# ` al inicio de línea | — |
| H2 | `## ` al inicio de línea | — |
| H3 | `### ` al inicio de línea | — |
| Inline code | `` `text` `` | — |
| Code block | ```` ```\ntext\n``` ```` | — |
| Link | `[text](url)` | `Ctrl+Shift+K` |
| List | `- ` al inicio de línea | — |
| Numbered list | `1. ` al inicio de línea | — |

- Si hay texto seleccionado, lo envuelve con la sintaxis. Si no, inserta plantilla con cursor posicionado.
- Controles de zoom a la izquierda: botones `A-` y `A+`, solo afectan el `font-size` del editor.
- Rango de zoom: 10px – 32px, incremento de 2px.

**Prueba:** Seleccionar texto, aplicar formatos, verificar que se inserta la sintaxis correcta. Probar zoom.  
**Commit:** `feat: format toolbar and zoom controls`

---

## Fase 4 – Modo edición / modo lectura

**Objetivo:** Botón en el toolbar que alterna entre editar y previsualizar.

### Modo edición (por defecto)
- Muestra el editor de texto (CodeMirror) con la sintaxis visible
- Todos los botones del toolbar activos

### Modo lectura
- Oculta el editor, muestra un panel de previsualización HTML
- Renderiza Markdown con `marked` + `DOMPurify`
- Soporta: negrita, cursiva, títulos, listas, tablas, bloques de código, enlaces, tachado
- Para ficheros `.txt`: renderiza igualmente (texto plano con formato Markdown si lo contiene)
- Los botones de formato se deshabilitan (no se ocultan) en modo lectura
- El footer sigue mostrando información

### Botón en el toolbar
- Icono de ojo (👁) o similar, a la izquierda del toolbar
- Etiqueta: "Read" en modo edición / "Edit" en modo lectura
- Shortcut: `Ctrl+Shift+P`

**Prueba:** Escribir Markdown, cambiar a modo lectura, verificar renderizado. Probar con `.txt` y `.md`.  
**Commit:** `feat: edit and read mode toggle`

---

## Fase 5 – Panel de configuración

**Objetivo:** Botón de configuración a la derecha del toolbar que abre un panel lateral o modal.

### Opciones de configuración
- **Theme:**
  - Light
  - Dark
  - Use system setting (por defecto)
- **Editor font** (4 opciones):
  - `Consolas` (por defecto, monoespaciada)
  - `Segoe UI`
  - `Georgia`
  - `JetBrains Mono`
- **Word wrap** (toggle on/off): si activado, las líneas largas hacen salto visual sin `\n`

### Persistencia
- La configuración se guarda en `localStorage` o fichero de configuración local
- Se restaura automáticamente al volver a abrir la app

**Prueba:** Cambiar tema, fuente y word wrap. Cerrar y volver a abrir la app, verificar que se recuerda.  
**Commit:** `feat: settings panel with theme, font and word wrap`

---

## Resumen de fases

| Fase | Descripción | Commit |
|---|---|---|
| 0 | Esqueleto del proyecto | `feat: project scaffold` |
| 1 | Editor + pestañas + footer | `feat: base editor with tabs and footer` |
| 2 | Menús File y Edit | `feat: toolbar menus File and Edit` |
| 3 | Formato de texto + zoom | `feat: format toolbar and zoom controls` |
| 4 | Modo edición / lectura | `feat: edit and read mode toggle` |
| 5 | Configuración | `feat: settings panel with theme, font and word wrap` |
