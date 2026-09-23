// Interactive 3D Robot Head Controller for BJCRUM Workflow Diagram
(function () {
  'use strict';

  let scene, camera, renderer, headModel;
  let canvas = null;
  let targetRotation = { x: 0, y: 0, z: 0 };
  let currentRotation = { x: 0, y: 0, z: 0 };
  let isMouseOver = false;
  let modelLoaded = false;

  // Generous padding to prevent any canvas clipping / slicing
  const TOP_PADDING = 90;
  const SIDE_PADDING = 40;
  const BOTTOM_PADDING = 20;

  let baseHeadY = 0.45;
  let baseHeadX = -0.02;
  let headScale = 0.59; // Scaled down from 0.78 for perfect natural body-to-head proportion
  let basePitch = 0.12; // Looking directly forward at camera by default
  let camY = 0.50;
  let lookY = 0.50;

  window._robotHeadState = {
    get baseHeadY() { return baseHeadY; },
    set baseHeadY(v) { baseHeadY = v; if (headModel) headModel.position.y = v; },
    get baseHeadX() { return baseHeadX; },
    set baseHeadX(v) { baseHeadX = v; if (headModel) headModel.position.x = v; },
    get headScale() { return headScale; },
    set headScale(v) { headScale = v; if (headModel) headModel.scale.set(v, v, v); },
    get basePitch() { return basePitch; },
    set basePitch(v) { basePitch = v; },
    get camY() { return camY; },
    set camY(v) {
      camY = v;
      if (camera) {
        camera.position.y = v;
        camera.lookAt(0, lookY, 0);
        camera.updateProjectionMatrix();
      }
    },
    get lookY() { return lookY; },
    set lookY(v) {
      lookY = v;
      if (camera) {
        camera.lookAt(0, v, 0);
        camera.updateProjectionMatrix();
      }
    },
    get headModel() { return headModel; },
    get camera() { return camera; },
    get scene() { return scene; },
    get renderer() { return renderer; },
    get canvas() { return canvas; }
  };

  // Backwards compatibility functions
  window._setBaseHeadY = function(val) { window._robotHeadState.baseHeadY = val; };
  window._setBaseHeadX = function(val) { window._robotHeadState.baseHeadX = val; };
  window._getBaseHeadY = function() { return baseHeadY; };
  window._getBaseHeadX = function() { return baseHeadX; };
  window._setBasePitch = function(val) { window._robotHeadState.basePitch = val; };
  window._getBasePitch = function() { return basePitch; };
  window._setHeadScale = function(val) { window._robotHeadState.headScale = val; };
  window._getHeadScale = function() { return headScale; };

  function getActiveContainer() {
    return document.querySelector('.framer-16ap2ei');
  }

  function unclipParents(container) {
    if (!container) return;
    container.style.overflow = 'visible';
    let parent = container.parentElement;
    while (parent && parent !== document.body) {
      if (parent.classList.contains('framer-ur3bl2')) break;
      parent.style.overflow = 'visible';
      parent = parent.parentElement;
    }
  }

  function ensureCanvas() {
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'robot-head-canvas';
      canvas.style.position = 'absolute';
      canvas.style.top = `-${TOP_PADDING}px`;
      canvas.style.left = `-${SIDE_PADDING}px`;
      canvas.style.width = `calc(100% + ${SIDE_PADDING * 2}px)`;
      canvas.style.height = `calc(100% + ${TOP_PADDING + BOTTOM_PADDING}px)`;
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '10';
      canvas.style.display = 'block';
      canvas.style.overflow = 'visible';
    }

    const container = getActiveContainer();
    if (container) {
      if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }
      unclipParents(container);
      if (canvas.parentNode !== container) {
        container.appendChild(canvas);
        console.log('[RobotHead] Attached extended canvas to live container with overflow headroom');
      }
    }
    return container;
  }

  function updateDimensions() {
    const container = getActiveContainer();
    if (!container || !canvas || !renderer || !camera) return;
    const rect = container.getBoundingClientRect();
    const contW = Math.max(rect.width, 139);
    const contH = Math.max(rect.height, 160);
    const w = contW + SIDE_PADDING * 2;
    const h = contH + TOP_PADDING + BOTTOM_PADDING;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function initThree() {
    const container = ensureCanvas();
    if (!container) return false;

    const rect = container.getBoundingClientRect();
    const contW = Math.max(rect.width, 139);
    const contH = Math.max(rect.height, 160);
    const width = contW + SIDE_PADDING * 2;
    const height = contH + TOP_PADDING + BOTTOM_PADDING;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera setup: Field of view 28 deg for minimal perspective distortion
    const aspect = width / height;
    camera = new THREE.PerspectiveCamera(28, aspect, 0.1, 100);
    camera.position.set(0, camY, 3.25);
    camera.lookAt(0, lookY, 0);

    // 3. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // 4. Lighting matching the illustration
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2.0, 3.0, 3.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fillLight.position.set(-2.5, 1.8, 2.0);
    scene.add(fillLight);

    const bluePointLight = new THREE.PointLight(0x0284c7, 3.0, 6);
    bluePointLight.position.set(0, -0.2, 1.2);
    scene.add(bluePointLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    backLight.position.set(0, 3.5, -2.0);
    scene.add(backLight);

    // 5. Mouse tracking
    function onMouseMove(e) {
      isMouseOver = true;
      const cur = getActiveContainer();
      if (!cur) return;
      const box = cur.getBoundingClientRect();
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height * 0.25;

      const dx = (e.clientX - centerX) / (window.innerWidth * 0.45);
      const dy = (e.clientY - centerY) / (window.innerHeight * 0.45);

      const maxYaw = 0.45;
      targetRotation.y = Math.max(-maxYaw, Math.min(maxYaw, dx * 0.5));

      const maxPitchUp = -0.24;
      const maxPitchDown = 0.18;
      targetRotation.x = Math.max(maxPitchUp, Math.min(maxPitchDown, dy * 0.3));

      targetRotation.z = -targetRotation.y * 0.08;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches[0]) onMouseMove(e.touches[0]);
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      isMouseOver = false;
      targetRotation.x = 0;
      targetRotation.y = 0;
      targetRotation.z = 0;
    });

    window.addEventListener('resize', updateDimensions);

    // 6. Start animation loop
    animate();

    // 7. Load GLB Model in background
    const loader = new THREE.GLTFLoader();
    loader.load(
      '/images/robot-head.glb',
      function (gltf) {
        headModel = gltf.scene;
        headModel.position.set(baseHeadX, baseHeadY, 0);
        headModel.scale.set(headScale, headScale, headScale);

        headModel.traverse(function (child) {
          if (child.isMesh && child.material) {
            child.material.envMapIntensity = 1.2;
            if (child.material.roughness !== undefined) {
              child.material.roughness = Math.min(child.material.roughness, 0.28);
            }
          }
        });

        scene.add(headModel);
        modelLoaded = true;
        window._robotHeadLoaded = true;
        console.log('[RobotHead] 3D head loaded and added to scene!');
      },
      undefined,
      function (err) {
        console.error('[RobotHead] Error loading GLB:', err);
      }
    );

    return true;
  }

  // Animation Loop: runs continuously
  let clock = { getElapsedTime: () => Date.now() * 0.001 };
  try { clock = new THREE.Clock(); } catch (_) {}

  function animate() {
    requestAnimationFrame(animate);

    // Watchdog: ALWAYS ensure canvas is attached and parents unclipped
    const container = getActiveContainer();
    if (container && canvas) {
      if (canvas.parentNode !== container) {
        container.appendChild(canvas);
        updateDimensions();
      }
      unclipParents(container);
    }

    if (headModel) {
      const time = clock.getElapsedTime ? clock.getElapsedTime() : Date.now() * 0.001;
      const breathY = Math.sin(time * 1.5) * 0.012;
      const breathPitch = Math.cos(time * 1.5) * 0.008;

      // Notice: basePitch gives default direct forward-facing gaze at the camera
      currentRotation.x += ((targetRotation.x + basePitch + breathPitch) - currentRotation.x) * 0.085;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.085;
      currentRotation.z += (targetRotation.z - currentRotation.z) * 0.085;

      headModel.rotation.x = currentRotation.x;
      headModel.rotation.y = currentRotation.y;
      headModel.rotation.z = currentRotation.z;

      headModel.position.x = baseHeadX;
      headModel.position.y = baseHeadY + breathY * 0.3;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function start() {
    if (!initThree()) {
      setTimeout(start, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
