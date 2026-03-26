# app.md

## Nombre de la app
FirstGod — Sistema de gestión para comercios con pago único.

## Stack técnico
HTML, CSS, JavaScript (Vanilla).

## Arquitectura general
Landing page estática con secciones navegables mediante smooth scroll que describe los beneficios del producto, enlaza a contacto de WhatsApp y próximamente presentará una demostración integrada mediante un video activado por scroll (scroll-driven tech tier).

## Estructura de archivos
- `index.html`: Página principal (landing page).
- `src/styles/`: Hojas de estilo (`main.css`, `components.css`, `animations.css`, `auto-tour.css`).
- `src/js/`: Lógica de interactividad básica de UI (`main.js`).
- `public/img/`: Activos gráficos e imágenes.
- `simulacion/`: Simulación demostrativa embebida.

## Módulos
1. **Landing Page:** Presentación comercial.
2. **Simulación/Demo:** Recorrido visual o interactivo del sistema base.

## Flujo de datos
Estático para la landing. Las peticiones de captura de clientes se redirigen externamente vía enlaces directos a WhatsApp.

## Estado y sesión
No manejado directamente en esta capa (landing estática).

## Hojas/Tablas
No aplica a la capa pública.

## Integraciones
- WhatsApp (Enlaces directos de soporte y ventas).
- Vimeo (Para reproducción de video demo embebido).

## Convenciones
- Clases CSS estilo BEM modificado (ej. `navbar__links`, `navbar--scrolled`).
- HTML semántico.
- JS encapsulado en IIFE para evitar contaminación global, inyectado directamente o en scripts referenciados.

## Problemas conocidos
N/A.
