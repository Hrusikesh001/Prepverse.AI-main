import React, { useEffect, useRef } from "react";

// Load Three.js from CDN if not already present
const threeScript = document.createElement("script");
threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
threeScript.async = true;
document.head.appendChild(threeScript);

const Globe = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, globe, ring, smallSphere;
    let animationFrameId;

    const init = () => {
      if (!canvasRef.current || !window.THREE) return;

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      // Scene setup
      scene = new window.THREE.Scene();
      camera = new window.THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      renderer = new window.THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Lighting
      const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const pointLight = new window.THREE.PointLight(0xffffff, 1.5);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      // Main Globe (white with glow)
      const globeGeometry = new window.THREE.IcosahedronGeometry(2, 5);
      const globeMaterial = new window.THREE.MeshStandardMaterial({
        color: 0xffffff, // white
        emissive: 0x4444ff, // subtle bluish glow
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.5,
        flatShading: true,
      });
      globe = new window.THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      // Wireframe overlay (to make globe look futuristic)
      const wireframe = new window.THREE.MeshBasicMaterial({
        color: 0xff6900,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      const globeWire = new window.THREE.Mesh(globeGeometry, wireframe);
      globe.add(globeWire);

      // Orbiting Ring
      const ringGeometry = new window.THREE.TorusGeometry(3, 0.05, 16, 100);
      const ringMaterial = new window.THREE.MeshStandardMaterial({
        color: 0xff6900,
        side: window.THREE.DoubleSide,
      });
      ring = new window.THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      // Small orbiting sphere
      const smallSphereGeometry = new window.THREE.SphereGeometry(0.2, 32, 32);
      const smallSphereMaterial = new window.THREE.MeshStandardMaterial({
        color: 0xff6900,
      });
      smallSphere = new window.THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
      smallSphere.position.set(3, 0, 0);
      ring.add(smallSphere);

      // Animate
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        globe.rotation.y += 0.003;
        ring.rotation.z += 0.002;
        renderer.render(scene, camera);
      };

      animate();
    };

    threeScript.onload = init;

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default Globe;
