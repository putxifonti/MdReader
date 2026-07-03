# Pendiente

## Crear el GitHub Release v0.1.0

El README ya tiene los enlaces correctos apuntando a la release v0.1.0.
Solo falta crear la release en GitHub y subir el zip.

### Pasos

1. Abre una terminal y autentícate si aún no lo has hecho:
   ```
   gh auth login
   ```

2. Crea la release y sube el zip:
   ```
   gh release create v0.1.0 "C:\dev\md-reader\dist-electron\MdReader-0.1.0-windows.zip" --title "MdReader v0.1.0" --notes "First release of MdReader — a minimalist Markdown-aware text editor for Windows." --repo putxifonti/MdReader
   ```

3. Una vez creada, comprueba que el enlace del README funciona:
   https://github.com/putxifonti/MdReader/releases/download/v0.1.0/MdReader-0.1.0-windows.zip

### Archivos listos en dist-electron/
- `MdReader Setup 0.1.0.exe` — instalador
- `MdReader-0.1.0-portable.exe` — portable
- `MdReader-0.1.0-windows.zip` — zip con los dos .exe (el que hay que subir)
