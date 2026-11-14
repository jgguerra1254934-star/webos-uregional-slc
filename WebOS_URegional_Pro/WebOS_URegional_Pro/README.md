# WebOS URegional Pro

Simulador académico de sistema operativo web para la Universidad Regional de Guatemala,
Sede Santa Lucía Cotzumalguapa.

## Requisitos
- Windows 10/11
- Node.js LTS
- Visual Studio Code

## Ejecutar
1. Extrae el ZIP.
2. Abre la carpeta `WebOS_URegional_Pro` en Visual Studio Code.
3. Abre la terminal integrada.
4. Ejecuta:

   ```bash
   npm install
   npm run dev
   ```

5. Abre en el navegador la dirección local que Vite muestre (normalmente
   `http://localhost:5173`).

## Compilar para publicar

```bash
npm run build
```

Vite generará la carpeta `dist`.

## Funciones
- Pantalla de arranque y de inicio de sesión (la sesión dura mientras la pestaña esté abierta).
- Explorador de archivos funcional: navegar, crear, renombrar y eliminar carpetas y archivos.
- Notas Académicas: abre archivos del explorador y guarda con Ctrl+S.
- Terminal con `ls`, `cd`, `cat`, `mkdir`, `touch`, `rm`, `echo > archivo`, `ps`, `kill`, `status`, `theme`, `neofetch` e historial con flechas.
- Administrador de Tareas: cada ventana abierta es un proceso con PID y se puede finalizar.
- Copilot URegional con respuestas locales sobre procesos, archivos y terminal.
- Datos guardados en `localStorage` (sistema de archivos y tema).

## Alcance académico y limitaciones
WebOS es una simulación que se ejecuta dentro del navegador. No reemplaza Windows,
no arranca desde BIOS y no administra procesos ni hardware real. Las métricas y el
Administrador de Procesos son demostrativos. Copilot utiliza reglas locales de
respuesta; todavía no está conectado a una API de IA externa. Para integrar un
modelo real se debe crear un backend y guardar la clave API en variables de entorno,
nunca directamente en el código del navegador.
