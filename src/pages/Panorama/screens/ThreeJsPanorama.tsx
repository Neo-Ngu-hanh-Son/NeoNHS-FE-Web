import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeJsPanorama = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      70, // slightly reduced for better perspective
      container.clientWidth / container.clientHeight,
      1,
      2000,
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "default",
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // FIX washed-out colors
    renderer.toneMapping = THREE.NoToneMapping; // prevent brightness shift

    container.appendChild(renderer.domElement);

    // Sphere
    const geometry = new THREE.SphereGeometry(500, 64, 48);
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    const texture = loader.load("/panorama/panorama-test-3-very-high.jpg");

    texture.colorSpace = THREE.SRGBColorSpace; // FIX color
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Controls (mouse drag)
    let lon = 0;
    let lat = 0;
    let isUserInteracting = false;
    let pointerX = 0;
    let pointerY = 0;
    let startLon = 0;
    let startLat = 0;

    const onPointerDown = (event: PointerEvent) => {
      isUserInteracting = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      startLon = lon;
      startLat = lat;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isUserInteracting) return;

      lon = (pointerX - event.clientX) * 0.1 + startLon;
      lat = (event.clientY - pointerY) * 0.1 + startLat;
    };

    const onPointerUp = () => {
      isUserInteracting = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);

    // Resize handler (important)
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", onResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      lat = Math.max(-85, Math.min(85, lat));

      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);

      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta),
      );

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);

      texture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ThreeJsPanorama;
