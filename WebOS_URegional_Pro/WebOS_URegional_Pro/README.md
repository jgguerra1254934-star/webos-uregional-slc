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

## Mejoras incluidas
- Copilot URegional con diagnóstico guiado de CPU, RAM, almacenamiento, procesos y seguridad.
- Administrador de Procesos con tareas simuladas y controles de finalizar/reiniciar.
- Centro de Control con indicadores de CPU, RAM y disco.
- Terminal con comandos `help`, `status`, `processes` y `theme dark|light`.
- Recuperación del sistema de archivos si los datos guardados en el navegador están dañados.
- Proyecto preparado con React, Vite y Tailwind CSS.

## Alcance académico y limitaciones
WebOS es una simulación que se ejecuta dentro del navegador. No reemplaza Windows,
no arranca desde BIOS y no administra procesos ni hardware real. Las métricas y el
Administrador de Procesos son demostrativos. Copilot utiliza reglas locales de
respuesta; todavía no está conectado a una API de IA externa. Para integrar un
modelo real se debe crear un backend y guardar la clave API en variables de entorno,
nunca directamente en el código del navegador.
