/**
 * FirstGod - Auto Tour JS
 * Implementación de MO-2: Timeline, Cursor y Actualización de Escena 1 (Dashboard)
 */

(function () {
  'use strict';

  // Datos Mock estructurados
  const mockData = {
    today: {
      sales: 1250000,
      clients: 12,
      stock: 12450000,
      ticket: 104166,
      products: [
        { name: 'Zapatillas Urban', qty: '12 un.', pos: 1 },
        { name: 'Remera Blanca', qty: '8 un.', pos: 2 }
      ],
      topClients: [
        { name: 'Martina López', val: '$350.000', pos: 1 },
        { name: 'Juan Pérez', val: '$120.000', pos: 2 }
      ],
      topSellers: [
        { name: 'Admin', val: '65.2%', pos: 1 },
        { name: 'Emilio', val: '34.8%', pos: 2 }
      ],
      recentSales: [
        { time: '13:45', client: 'Martina López', payment: 'TARJETA', amount: 350000 },
        { time: '11:20', client: 'Consumidor Final', payment: 'EFECTIVO', amount: 15500 }
      ]
    },
    yesterday: {
      sales: 1850000,
      clients: 18,
      stock: 12450000,
      ticket: 102777,
      products: [
        { name: 'Zapatillas Urban', qty: '18 un.', pos: 1 },
        { name: 'Mochila Negra', qty: '5 un.', pos: 2 }
      ],
      topClients: [
        { name: 'Carlos Gomez', val: '$450.000', pos: 1 },
        { name: 'Luis Silva', val: '$210.000', pos: 2 }
      ],
      topSellers: [
        { name: 'Lucía', val: '58.0%', pos: 1 },
        { name: 'Admin', val: '42.0%', pos: 2 }
      ],
      recentSales: [
        { time: '18:30 (Ayer)', client: 'Carlos Gomez', payment: 'TRANSFERENCIA', amount: 450000 },
        { time: '16:15 (Ayer)', client: 'Luis Silva', payment: 'EFECTIVO', amount: 210000 }
      ]
    },
    month: {
      sales: 37520000,
      clients: 420,
      stock: 12450000,
      ticket: 45600,
      products: [
        { name: 'Zapatillas Urban', qty: '342 un.', pos: 1 },
        { name: 'Remera Blanca', qty: '198 un.', pos: 2 }
      ],
      topClients: [
        { name: 'Martina López', val: '$1.250.000', pos: 1 },
        { name: 'Lucas Rivas', val: '$980.000', pos: 2 }
      ],
      topSellers: [
        { name: 'Admin', val: '45.8%', pos: 1 },
        { name: 'Lucía', val: '32.1%', pos: 2 }
      ],
      recentSales: [
        { time: '24 Mar', client: 'Martina López', payment: 'TARJETA', amount: 350000 },
        { time: '21 Mar', client: 'Lucas Rivas', payment: 'TRANSFERENCIA', amount: 980000 }
      ]
    }
  };

  /** Formato de moneda ARS */
  const formatMoney = (val) => {
    return '$' + Math.round(val).toLocaleString('es-AR');
  };

  /** Animación CounterUp rápida y suave */
  const animateValue = (obj, start, end, duration, isMoney = false) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * (end - start) + start);
      
      obj.textContent = isMoney ? formatMoney(currentVal) : currentVal.toLocaleString('es-AR');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = isMoney ? formatMoney(end) : end.toLocaleString('es-AR');
      }
    };
    window.requestAnimationFrame(step);
  };

  document.addEventListener('DOMContentLoaded', () => {
    
    // Contenedores y Elementos
    const appContainer = document.getElementById('auto-tour-app');
    const cursor = document.getElementById('auto-tour-cursor');
    
    // KPIs
    const kpiSales = document.getElementById('kpi-sales');
    const kpiClients = document.getElementById('kpi-clients');
    const kpiStock = document.getElementById('kpi-stock');
    const kpiTicket = document.getElementById('kpi-ticket');
    
    // Chips de tiempo
    const chipToday = document.getElementById('chip-today');
    const chipYesterday = document.getElementById('chip-yesterday');
    const chipMonth = document.getElementById('chip-month');
    
    // Rankings
    const listProducts = document.getElementById('top-products');
    const listClients = document.getElementById('top-clients');
    const listSellers = document.getElementById('top-sellers');
    const listSales = document.getElementById('recent-sales-list');

    // Sidebar
    const sidebar = document.getElementById('tour-sidebar');
    const sidebarToggle = document.getElementById('tour-sidebar-toggle');

    // Estado actual para la animación de números
    let currentData = { sales: 0, clients: 0, stock: 0, ticket: 0 };

    /** Utilidad de tiempo de espera Async */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /** Motor de Puntero Fantasma */
    const moveCursorTo = async (element, offsetX = 0, offsetY = 0) => {
      if (!element || !appContainer) return;
      
      const appRect = appContainer.getBoundingClientRect();
      const elRect = element.getBoundingClientRect();
      
      // Validar si el elemento es visible
      if (elRect.width === 0 || elRect.height === 0) return;

      const cursorX = (elRect.left - appRect.left) + (elRect.width / 2) + offsetX;
      const cursorY = (elRect.top - appRect.top) + (elRect.height / 2) + offsetY;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      // Esperamos que termine la transición CSS base (aprox 600ms)
      await sleep(700);
    };

    const simulateClick = async (element) => {
      cursor.classList.add('clicking');
      element.classList.add('hover'); // Simular hover state nativo
      await sleep(150);
      cursor.classList.remove('clicking');
      await sleep(150);
      element.classList.remove('hover');
    };

    /** Renderizador de Rankings */
    const renderRankings = (dataObj) => {
      // Products
      if (listProducts) {
        listProducts.innerHTML = dataObj.products.map(p => `
          <div class="fg-ranking-item">
            <div class="fg-ranking-position ${p.pos > 1 ? 'pos-2' : ''}">${p.pos}</div>
            <div class="fg-ranking-info"><div class="fg-ranking-name">${p.name}</div></div>
            <div class="fg-ranking-value" style="font-weight:600;">${p.qty}</div>
          </div>
        `).join('');
      }

      // Clients
      if (listClients) {
        listClients.innerHTML = dataObj.topClients.map(c => `
          <div class="fg-ranking-item">
            <div class="fg-ranking-position ${c.pos > 1 ? 'pos-2' : ''}">${c.pos}</div>
            <div class="fg-ranking-info"><div class="fg-ranking-name">${c.name}</div></div>
            <div class="fg-ranking-value" style="font-weight:600;">${c.val}</div>
          </div>
        `).join('');
      }

      // Sellers
      if (listSellers) {
        listSellers.innerHTML = dataObj.topSellers.map(s => `
          <div class="fg-ranking-item">
            <div class="fg-ranking-position ${s.pos > 1 ? 'pos-2' : ''}">${s.pos}</div>
            <div class="fg-ranking-info"><div class="fg-ranking-name">${s.name}</div></div>
            <div class="fg-ranking-value" style="font-weight:600;">${s.val}</div>
          </div>
        `).join('');
      }

      // Sales Historial
      if (listSales) {
        listSales.innerHTML = dataObj.recentSales.map(v => `
          <tr style="border-bottom: 1px solid var(--border-light);">
            <td style="padding: 12px 16px; color: var(--text-secondary);">${v.time}</td>
            <td style="padding: 12px 16px; font-weight: 500; font-size: 14px;">${v.client}</td>
            <td style="padding: 12px 16px;"><span style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: var(--bg-hover); color: var(--text-secondary);">${v.payment}</span></td>
            <td style="padding: 12px 16px; font-weight: 600; text-align: right;">${formatMoney(v.amount)}</td>
          </tr>
        `).join('');
      }
    };

    /** Aplicador de Dataset */
    const applyDataset = (datasetKey, targetChip) => {
      const targetData = mockData[datasetKey];
      
      // Actualizar visual de Chips
      [chipToday, chipYesterday, chipMonth].forEach(c => c.classList.remove('active'));
      targetChip.classList.add('active');

      // Animar métricas (1000ms duration)
      animateValue(kpiSales, currentData.sales, targetData.sales, 800, true);
      animateValue(kpiClients, currentData.clients, targetData.clients, 800, false);
      animateValue(kpiStock, currentData.stock, targetData.stock, 800, true);
      animateValue(kpiTicket, currentData.ticket, targetData.ticket, 800, true);
      
      // Volcar HTML en rankings
      renderRankings(targetData);

      // Guardar status
      currentData = { ...targetData };
    };


    /** 
     * TIMELINE CENTRAL: ESCENA 1 (INICIO)
     */
    const startTour = async () => {
      // Setup inicial "Hoy" estático rapido antes de iniciar ciclo
      applyDataset('today', chipToday);
      await sleep(2000); // 2 segundos donde contemplamos ventas de "Hoy"

      // 1. COLLAPSE SIDEBAR PARA DAR ESPACIO
      if (sidebar && sidebarToggle) {
        await moveCursorTo(sidebarToggle);
        await simulateClick(sidebarToggle);
        sidebar.classList.add('collapsed');
        await sleep(1500); // Dar momento para procesar el resize de UI
      }

      // 1. VIAJAMOS Y CLICK A "AYER"
      await moveCursorTo(chipYesterday);
      await simulateClick(chipYesterday);
      applyDataset('yesterday', chipYesterday);
      await sleep(2500); // 2.5 seg contemplando "Ayer"

      // 2. VIAJAMOS Y CLICK A "1 MES"
      await moveCursorTo(chipMonth);
      await simulateClick(chipMonth);
      applyDataset('month', chipMonth);
      await sleep(3500);

      // (Acá en el próximo MO uniremos con la escena de Ventas)
    };

    // Usar IntersectionObserver para arrancar la demo SOLO cuando el usuario baje y lo vea
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Ya visible: Arrancamos loop / sequence
          setTimeout(startTour, 500); // Pequeño respiro inicial al scrollear
          observer.disconnect(); // Ejecutamos la carga inicial una sola vez
        }
      });
    }, { threshold: 0.5 });

    if(appContainer) {
       observer.observe(appContainer);
    }
    
    /** 
     * Auto-Escalado para vista 100% Mobile
     * Mantiene la proporción como si fuera un video o imagen cuando la pantalla es reducida
     */
    const mockupMain = document.querySelector('.hero__mockup-main');
    const scaleShowcase = () => {
      if (!mockupMain) return;
      const idealWidth = 960;
      const showcaseWrapper = mockupMain.parentElement; // .hero__showcase
      const availableWidth = showcaseWrapper.clientWidth;
      
      if (availableWidth < idealWidth) {
        const scale = availableWidth / idealWidth;
        // Fijamos el ancho y escalamos todo el conjunto
        mockupMain.style.width = idealWidth + 'px';
        mockupMain.style.transform = `scale(${scale})`;
        mockupMain.style.transformOrigin = 'top left';
        // Ajustamos la altura del padre para evitar espacio vacío extra
        showcaseWrapper.style.height = (mockupMain.offsetHeight * scale) + 'px';
      } else {
        // Restaurar a default en pantallas grandes
        mockupMain.style.width = '100%';
        mockupMain.style.transform = 'none';
        showcaseWrapper.style.height = 'auto';
      }
    };

    window.addEventListener('resize', scaleShowcase);
    // Ejecutar tras carga de estilos
    setTimeout(scaleShowcase, 100);

  });

})();
