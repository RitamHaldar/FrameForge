import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AuthBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 70;

    // 3. Renderer with high performance & alpha
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Holographic Cryptographic Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(13, 1);
    const icoWire = new THREE.WireframeGeometry(icoGeo);
    const icoMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const icosahedron = new THREE.LineSegments(icoWire, icoMat);
    coreGroup.add(icosahedron);

    // Outer cryptographic orbit ring
    const torusGeo = new THREE.TorusGeometry(22, 0.22, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });
    const torusRing = new THREE.Mesh(torusGeo, torusMat);
    torusRing.rotation.x = Math.PI / 3;
    coreGroup.add(torusRing);

    // Secondary tilted ring
    const torusGeo2 = new THREE.TorusGeometry(26, 0.14, 16, 100);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });
    const torusRing2 = new THREE.Mesh(torusGeo2, torusMat2);
    torusRing2.rotation.y = Math.PI / 4;
    coreGroup.add(torusRing2);

    // Position core in ambient background depth, gently offset to the right on desktop
    const updateCorePosition = () => {
      const isDesktop = window.innerWidth >= 1024;
      coreGroup.position.set(isDesktop ? 16 : 0, 0, -10);
    };
    updateCorePosition();

    // 5. Particle Constellation
    const particleCount = 130;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70;

      velocities.push({
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.015,
      });
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Texture with Soft Glowing Dot
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
    grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.35)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);
    const particleMat = new THREE.PointsMaterial({
      size: 2.0,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Inter-Particle Connecting Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
    });
    const maxLineSegments = particleCount * 5;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 10;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 10;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Viewport Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      updateCorePosition();
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId;
    const posAttr = particleGeo.attributes.position;
    const linePosAttr = lineGeo.attributes.position;

    const animate = () => {
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(0, 0, 0);

      // Ambient rotation of central holographic core
      coreGroup.rotation.y += 0.0025;
      coreGroup.rotation.x += 0.0012;
      torusRing.rotation.z += 0.003;
      torusRing2.rotation.x -= 0.0025;

      // Particle physics & boundary bounce
      const array = posAttr.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        array[i3] += velocities[i].x;
        array[i3 + 1] += velocities[i].y;
        array[i3 + 2] += velocities[i].z;

        if (array[i3] > 75 || array[i3] < -75) velocities[i].x *= -1;
        if (array[i3 + 1] > 55 || array[i3 + 1] < -55) velocities[i].y *= -1;
        if (array[i3 + 2] > 35 || array[i3 + 2] < -35) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // Connect proximate particles
      let lineIdx = 0;
      const lineArray = linePosAttr.array;
      const maxDistance = 18;

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = array[i * 3] - array[j * 3];
          const dy = array[i * 3 + 1] - array[j * 3 + 1];
          const dz = array[i * 3 + 2] - array[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance && lineIdx < maxLineSegments * 6 - 6) {
            lineArray[lineIdx++] = array[i * 3];
            lineArray[lineIdx++] = array[i * 3 + 1];
            lineArray[lineIdx++] = array[i * 3 + 2];

            lineArray[lineIdx++] = array[j * 3];
            lineArray[lineIdx++] = array[j * 3 + 1];
            lineArray[lineIdx++] = array[j * 3 + 2];
          }
        }
      }

      for (let k = lineIdx; k < maxLineSegments * 6; k++) {
        lineArray[k] = 0;
      }
      linePosAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Strict GPU Disposal & Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      icoGeo.dispose();
      icoWire.dispose();
      icoMat.dispose();

      torusGeo.dispose();
      torusMat.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();

      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();

      lineGeo.dispose();
      lineMat.dispose();

      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#08090A]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Technical Grid & Ambient Dots */}
      <div className="absolute inset-0 tech-grid opacity-35 z-10" />
      <div className="absolute inset-0 tech-dots opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] z-10" />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-cyanAccent/[0.04] blur-[140px] z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] max-w-[700px] rounded-full bg-emerald-500/[0.03] blur-[160px] z-10" />

      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#08090A]/40 to-[#08090A]/90 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,9,10,0.75)_100%)] z-10" />
    </div>
  );
}
