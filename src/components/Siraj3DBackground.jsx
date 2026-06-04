import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Siraj3DBackground = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const currentMount = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020704, 0.015); // Fog hides the extreme outer edges smoothly

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Generate Concentric 3D Grid Rings
    const group = new THREE.Group();
    const ringCount = 25;

    for (let i = 0; i < ringCount; i++) {
      const radius = 6 + i * 2.2;
      const segments = 6; // Set to 6 for hexagons, or 32 for perfect smooth circles
      const geometry = new THREE.RingGeometry(radius, radius + 0.12, segments);

      geometry.rotateZ((i * Math.PI) / 12); // Staggers the rings for geometry styling

      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff88, // Matches your green brand color
        wireframe: true,
        transparent: true,
        opacity: Math.max(0.01, 0.32 - (i * 0.013)), // Naturally dims as the rings expand outward
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -i * 1.5; // Distributes down the Z axis to establish depth
      group.add(mesh);
    }

    scene.add(group);

    // 3. Mouse Movement Vector Calculations
    const handleMouseMove = (event) => {
      mouseRef.current.targetX = (event.clientX / window.innerWidth - 0.5) * 10;
      mouseRef.current.targetY = (event.clientY / window.innerHeight - 0.5) * 10;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 4. Render Loop with Smooth Inertia (Lerping)
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Constant fluid ambient rotation
      group.rotation.z = elapsedTime * 0.025;
      group.rotation.y = elapsedTime * 0.012;

      // Smooth camera interpolation based on mouse tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      camera.position.x = mouseRef.current.x;
      camera.position.y = -mouseRef.current.y;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // 5. Handling Device Resize Actions
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, // Injects it right behind your foreground content array
        pointerEvents: 'none' // Ensures users can still interact with buttons or links over it
      }}
    />
  );
};
