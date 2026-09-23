'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface RobotHeadCanvasProps {
  className?: string;
}

export default function RobotHeadCanvas({ className = '' }: RobotHeadCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let headModel: THREE.Group | null = null;
    let animationFrameId: number | null = null;

    const baseHeadY = 0.45;
    const baseHeadX = -0.02;
    const headScale = 0.59;
    const basePitch = 0.12;
    const camY = 0.50;
    const lookY = 0.50;

    let targetRotX = basePitch;
    let targetRotY = 0;
    let currentRotX = basePitch;
    let currentRotY = 0;

    try {
      scene = new THREE.Scene();

      const width = container.clientWidth || 380;
      const height = container.clientHeight || 380;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, camY, 2.6);
      camera.lookAt(0, lookY, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
      keyLight.position.set(2, 3, 3);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x0284c7, 1.5);
      fillLight.position.set(-2, 1, 1);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
      rimLight.position.set(0, 3, -2);
      scene.add(rimLight);

      container.appendChild(renderer.domElement);

      // Load 3D Robot Head GLTF
      const loader = new GLTFLoader();
      loader.load(
        '/models/robot-head.glb',
        (gltf) => {
          headModel = gltf.scene;
          headModel.position.set(baseHeadX, baseHeadY, 0);
          headModel.scale.set(headScale, headScale, headScale);
          headModel.rotation.set(basePitch, 0, 0);
          scene?.add(headModel);
          setLoading(false);
        },
        undefined,
        (err) => {
          console.warn('Robot head 3D model fallback to poster:', err);
          setError(true);
          setLoading(false);
        }
      );

      // Mouse tracking
      const onPointerMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)));
        const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)));

        targetRotY = -normX * 0.45;
        targetRotX = basePitch + normY * 0.35;
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });

      // Resize
      const onResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', onResize);

      // Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Smooth Lerp
        currentRotX += (targetRotX - currentRotX) * 0.08;
        currentRotY += (targetRotY - currentRotY) * 0.08;

        if (headModel) {
          headModel.rotation.x = currentRotX;
          headModel.rotation.y = currentRotY;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('resize', onResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer && renderer.domElement) {
          renderer.domElement.remove();
          renderer.dispose();
        }
      };
    } catch (e) {
      console.error('WebGL init error:', e);
      setError(true);
      setLoading(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-visible select-none ${className}`}
      style={{ minHeight: '320px', minWidth: '320px' }}
    >
      {/* 3D Fallback / Loading Poster */}
      {(loading || error) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/robot_closeup.png"
            alt="BJCRUM Robot"
            className="w-48 h-48 object-contain drop-shadow-xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/566csQkwAzFmNqUmvFdjzVkalo.jpg';
            }}
          />
        </div>
      )}
    </div>
  );
}
