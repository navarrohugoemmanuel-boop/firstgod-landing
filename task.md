# task.md

## A) Resumen
Refactorización de landing page para aumentar percepción premium, priorizar compresión del valor sobre el precio, y agregar experiencia guiada por scroll de video interactivo.

## B) Tipo
MEJORAR UI / UX / Frontend

## C) Alcance
**Archivos a tocar:**
- `index.html` (copy, estructura de landing).
- `src/styles/components.css`, `src/styles/main.css` (ajustes visuales, layout, animaciones).
- `src/js/main.js` (lógica vinculada al video dependiente del scroll, si es necesaria).

**Archivos a NO tocar:**
- Lógica de backend (inexistente aquí en `WEB`).
- La simulación interactiva independiente en `/simulacion/`.
- Archivos fuera de la raíz de la landing que no intercedan en su fluidez visual.

## D) Micro-objetivos

### MO-1: Limpieza del NavBar y Ajuste del Hero
- **Resultado clave:** El Hero carece de insignias de pago/precio o "comercio" superiores, los textos secundarios transmiten el valor rápido, "Pagás una vez..." está destacado, el hero sube, y no hay CTAs ansiosos.
- **Tareas:**
  - Remover badge inicial.
  - Ajustar títulos (`hero__title` y `hero__subtitle`).
  - Agregar destacado `Pagás una vez y es tuyo para siempre.`.
  - Quitar `#pricing` y "Ver planes" / "Ver precios" de `navbar` y hero buttons.
  - Ajustar márgenes para subir contenido.
- **Archivos impactados:** `index.html`, `src/styles/components.css`.
- **Riesgos:** Descuadre en mobile.
- **Prueba:** Entrar a la app, ver que el hero se siente más alto y directo. Validar en mobile no encontrar el pricing en primera pantalla.

### MO-2: Implementación de Video Guiado por Scroll (Secuencia Visual)
- **Resultado clave:** Integración limpia, fluida y premium de un área donde avanza una demostración audiovisual guiada/gatillada por scroll, transmitiendo robustez y control.
- **Tareas:**
  - Sustituir el `<div class="hero__showcase">` estático / auto-tour iframe por un ecosistema adaptado a video/animación que avanza al hacer scroll o al llegar a su contenedor.
  - Añadir diseño premium al contenedor estilo hardware/pantalla.
  - Insertar CTA específico al terminar esta secuencia para "avanzar con descuento" o "consultar", NO "ver precios".
- **Archivos impactados:** `index.html`, estilos relevantes, `main.js`.
- **Riesgos:** Performance de scroll de video o mala adaptación a pantallas celulares.
- **Prueba:** Scrollear por la web y confirmar que el video/animación reacciona a mi posición, informando qué hace el software sin pedir clics.

### MO-3: Refinamiento de Problemas, Soluciones, Social Proof y Diferenciales
- **Resultado clave:** La percepción de continuidad e incondicionalidad domina los beneficios. El user confía más en la marca a golpes de vista.
- **Tareas:**

  - Social Proof: Reemplazar grid numérico ("resultados reales") por franja solida de "Marcas que confían" fija.
- **Archivos impactados:** `index.html`.
- **Riesgos:** Textos que rompan flexbox en algunas cards.
- **Prueba:** Leé secciones problemas/beneficios de una pasada. Chequeá la nueva franja de prueba social que sea sobria y la robusta de "otros vs FirstGod".

### MO-4: CTA Final y Botonera a WhatsApp
- **Resultado clave:** El call to action último comunica eficiencia ("...en 24 horas") y es puramente un puente a la venta humana (chat directo), promoviendo descuento.
- **Tareas:**
  - Modificar el `.cta-box` pre-footer.
  - Textos nuevos: “Tu negocio puede estar ordenado en 24 horas.” & “Escribinos para acceder con el 50% de descuento al sistema.”
  - Botón: "Escribinos por WhatsApp".
- **Archivos impactados:** `index.html`.
- **Riesgos:** Ninguno.
- **Prueba:** Pulsar CTA inferior y asegurar que el link a WA se mantiene operativo.

## E) Checklist final
- [ ] Navbar y hero libres de "Precios" o ansia de cobro.
- [ ] Títulos y bajadas actualizados, la frase "para siempre" resalta.
- [ ] Inclusión de video integrado / scroll-driven con CTA de fin de recorrido.
- [ ] Franja social estática sutil añadida (marcas).
- [ ] FAQ, Problemas y Soluciones incorporando objeción de Google Drive y persistencia.
- [ ] Nuevo Cierre pre-footer que acelera instalación y presenta descuentazo.
