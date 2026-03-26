/* ============================================
   MAIN.JS — FirstGod Landing Interactivity
   ============================================ */

(function () {
  'use strict';

  /* ——————————————————————————————————————————
     1. NODE NETWORK (Canvas) — background tech
     —————————————————————————————————————————— */
  function initNodeNetwork() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = -9999;
    let mouseY = -9999;
    let animFrame;

    // Config
    const NODE_COUNT_DESKTOP = 80;
    const NODE_COUNT_MOBILE = 35;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_RADIUS = 200;
    const NODE_COLOR = 'rgba(160, 160, 170, ';       // gris neutro
    const LINE_COLOR = 'rgba(180, 180, 190, ';        // gris sutil
    const MOUSE_LINE_COLOR = 'rgba(10, 10, 10, ';     // negro absoluto (accent)

    let nodes = [];

    function getNodeCount() {
      return window.innerWidth < 768 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    }

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createNodes() {
      const count = getNodeCount();
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 0.8,
        });
      }
    }

    function drawNode(node, alpha) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLOR + alpha + ')';
      ctx.fill();
    }

    function drawLine(x1, y1, x2, y2, alpha, color) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color + alpha + ')';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    function update() {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off edges
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Soft mouse attraction
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.008;
          n.vx += dx * force;
          n.vy += dy * force;
        }

        // Speed limiter
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 1) {
          n.vx *= 0.98;
          n.vy *= 0.98;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.45;
            // Gradiente sutil entre nodos
            const linGrad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            linGrad.addColorStop(0, 'rgba(0, 0, 0, ' + alpha + ')');
            linGrad.addColorStop(1, 'rgba(0, 0, 0, ' + (alpha * 0.2) + ')');

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = linGrad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Interaction with mouse nodes
      for (let i = 0; i < nodes.length; i++) {
        const dx = mouseX - nodes[i].x;
        const dy = mouseY - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.4;
          drawLine(mouseX, mouseY, nodes[i].x, nodes[i].y, alpha, 'rgba(0,0,0, ');

          // Efecto de pulso en el nodo cercano al mouse
          ctx.beginPath();
          ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0, ' + (alpha * 0.3) + ')';
          ctx.fill();
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        drawNode(nodes[i], 0.7);
      }
    }

    function loop() {
      update();
      draw();
      animFrame = requestAnimationFrame(loop);
    }

    // Event listeners
    window.addEventListener('resize', function () {
      resize();
      nodes = [];
      createNodes();
    });

    // Mouse tracking on the hero only
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });

      heroEl.addEventListener('mouseleave', function () {
        mouseX = -9999;
        mouseY = -9999;
      });
    }

    // Init
    resize();
    createNodes();
    loop();
  }

  /* ——————————————————————————————————————————
     2. SCROLL REVEAL (Intersection Observer)
     —————————————————————————————————————————— */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ——————————————————————————————————————————
     3. PARALLAX (subtle mockup tilt on mouse)
     —————————————————————————————————————————— */
  function initMockupParallax() {
    const showcase = document.querySelector('.hero__showcase');
    if (!showcase) return;

    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    heroEl.addEventListener('mousemove', function (e) {
      const rect = heroEl.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    });

    heroEl.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
    });

    function lerpParallax() {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      showcase.style.transform =
        'perspective(1200px) rotateX(' + currentY + 'deg) rotateY(' + currentX + 'deg)';

      requestAnimationFrame(lerpParallax);
    }
    lerpParallax();
  }

  /* ——————————————————————————————————————————
     3.5 AMBIENT ORBS (Floating gradients)
     —————————————————————————————————————————— */
  function initAmbientOrbs() {
    const orbs = document.querySelectorAll('.ambient-orb');
    if (!orbs.length) return;

    function moveOrbs() {
      const time = Date.now() * 0.001;
      orbs.forEach(function (orb, i) {
        const shiftX = Math.sin(time * 0.3 + i) * 60;
        const shiftY = Math.cos(time * 0.4 + i) * 60;
        orb.style.transform = 'translate(' + shiftX + 'px, ' + shiftY + 'px)';
      });
      requestAnimationFrame(moveOrbs);
    }
    moveOrbs();
  }

  /* ——————————————————————————————————————————
     4. SHOWCASE TABS (How it works)
     —————————————————————————————————————————— */
  function initShowcaseTabs() {
    var tabs = document.querySelectorAll('.showcase__tab');
    var panels = document.querySelectorAll('.showcase__panel-slide');
    if (!tabs.length || !panels.length) return;

    var currentStep = 1;
    var autoPlayTimer = null;
    var AUTO_PLAY_DELAY = 5000; // 5 seconds (matches CSS progress bar)

    function activateStep(step) {
      currentStep = step;

      // Update tabs
      tabs.forEach(function (tab) {
        var isActive = parseInt(tab.getAttribute('data-step')) === step;
        tab.classList.toggle('is-active', isActive);

        // Reset progress bar animation
        var bar = tab.querySelector('.showcase__tab-progress-bar');
        if (bar) {
          bar.style.animation = 'none';
          // Trigger reflow
          void bar.offsetHeight;
          bar.style.animation = '';
        }
      });

      // Update panels
      panels.forEach(function (panel) {
        var isActive = parseInt(panel.getAttribute('data-panel')) === step;
        panel.classList.toggle('is-active', isActive);
      });
    }

    function nextStep() {
      var next = currentStep >= 3 ? 1 : currentStep + 1;
      activateStep(next);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextStep, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // Click handlers
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var step = parseInt(tab.getAttribute('data-step'));
        activateStep(step);
        startAutoPlay(); // restart timer after manual click
      });
    });

    // Start auto-play
    startAutoPlay();
  }



  /* ——————————————————————————————————————————
     6. RIPPLE EFFECT (CTA button)
     —————————————————————————————————————————— */
  function initRippleEffect() {
    var ctaBtn = document.getElementById('cta-main-btn');
    if (!ctaBtn) return;

    ctaBtn.addEventListener('click', function (e) {
      e.preventDefault();

      var rect = ctaBtn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';

      var size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

      ctaBtn.appendChild(ripple);

      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  }


  /* ——————————————————————————————————————————
     7. SCROLL-DRIVEN VIDEO
     —————————————————————————————————————————— */
  function initScrollVideo() {
    var container = document.getElementById('scroll-video-container');
    var video = document.getElementById('scroll-video');
    
    if (!container || !video) return;
    video.pause();

    function updateVideoOnScroll() {
      var rect = container.getBoundingClientRect();
      var containerTop = rect.top;
      var containerHeight = rect.height;
      var windowHeight = window.innerHeight;

      // Distancia scrolleable real de este bloque
      var scrollDistance = containerHeight - windowHeight;
      if (scrollDistance <= 0) scrollDistance = 1;

      // Progreso (0 a 1)
      var progress = -containerTop / scrollDistance;
      
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      if (!isNaN(video.duration)) {
        // Truco para mayor fluidez: 
        // Se asume que el video tiene keyframes frecuentes.
        video.currentTime = video.duration * progress;
      }
    }

    video.addEventListener('loadedmetadata', function () {
      updateVideoOnScroll();
    });

    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateVideoOnScroll);
    }, { passive: true });

    window.addEventListener('resize', function () {
      requestAnimationFrame(updateVideoOnScroll);
    });
  }


  /* ——————————————————————————————————————————
     INIT
     —————————————————————————————————————————— */
  document.addEventListener('DOMContentLoaded', function () {
    initNodeNetwork();
    initScrollReveal();
    initMockupParallax();
    initAmbientOrbs();
    initShowcaseTabs();
    initRippleEffect();
    initScrollVideo();
  });
})();
