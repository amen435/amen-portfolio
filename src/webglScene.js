import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initInteractiveScene() {
  const canvas = document.getElementById('scene-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;

  // ── Lights ───────────────────────────────────────────────
  const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambLight);
  const pointLight = new THREE.PointLight(0x00ffe7, 3, 40);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
  const pointLight2 = new THREE.PointLight(0xff00c8, 2, 30);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  // ── Neon Grid Plane ──────────────────────────────────────
  const gridHelper = new THREE.GridHelper(60, 30, 0x00ffe7, 0x002233);
  gridHelper.position.y = -4;
  gridHelper.rotation.x = 0.1;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;
  scene.add(gridHelper);

  const gridHelperTop = new THREE.GridHelper(60, 30, 0xff00c8, 0x220033);
  gridHelperTop.position.y = 4;
  gridHelperTop.rotation.x = -0.1;
  gridHelperTop.material.transparent = true;
  gridHelperTop.material.opacity = 0.1;
  scene.add(gridHelperTop);

  // ── Wireframe Geometries ─────────────────────────────────
  const geometries = [];
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0x00ffe7, wireframe: true, transparent: true, opacity: 0.3 }),
    new THREE.MeshBasicMaterial({ color: 0xff00c8, wireframe: true, transparent: true, opacity: 0.3 }),
    new THREE.MeshBasicMaterial({ color: 0xffe600, wireframe: true, transparent: true, opacity: 0.2 })
  ];

  const shapes = [
    new THREE.OctahedronGeometry(1.5),
    new THREE.IcosahedronGeometry(2),
    new THREE.TetrahedronGeometry(1.2)
  ];

  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(
      shapes[Math.floor(Math.random() * shapes.length)],
      materials[Math.floor(Math.random() * materials.length)]
    );
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10 - 5
    );
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.02,
      ry: (Math.random() - 0.5) * 0.02,
      rz: (Math.random() - 0.5) * 0.02
    };
    scene.add(mesh);
    geometries.push(mesh);
  }

  // ── Floating Particles ───────────────────────────────────
  const PARTICLE_COUNT = 800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const vels = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    vels.push({
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    });
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);


  // ── Mouse Tracking ───────────────────────────────────────
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ── Animation Loop ───────────────────────────────────────
  let rafId;
  function animate() {
    rafId = requestAnimationFrame(animate);

    // Camera inertia
    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;
    camera.position.x = target.x * 3;
    camera.position.y = target.y * 3;
    camera.lookAt(0, 0, 0);

    // Rotate geometries
    geometries.forEach(mesh => {
      mesh.rotation.x += mesh.userData.rx;
      mesh.rotation.y += mesh.userData.ry;
      mesh.rotation.z += mesh.userData.rz;
    });

    // Move particles
    const posAttr = particleGeo.attributes.position;
    const posArray = posAttr.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArray[i * 3] += vels[i].x;
      posArray[i * 3 + 1] += vels[i].y;
      posArray[i * 3 + 2] += vels[i].z;

      // Wrap around bounds
      if (Math.abs(posArray[i * 3]) > 15) posArray[i * 3] *= -1;
      if (Math.abs(posArray[i * 3 + 1]) > 10) posArray[i * 3 + 1] *= -1;
      if (Math.abs(posArray[i * 3 + 2]) > 10) posArray[i * 3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;

    // React to mouse
    particleSystem.rotation.y = target.x * 0.2;
    particleSystem.rotation.x = -target.y * 0.2;

    renderer.render(scene, camera);
  }
  
  // Only animate when section is in view for performance
  let isVisible = false;
  ScrollTrigger.create({
    trigger: '#webgl-scene',
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => { isVisible = true; animate(); },
    onLeave: () => { isVisible = false; cancelAnimationFrame(rafId); },
    onEnterBack: () => { isVisible = true; animate(); },
    onLeaveBack: () => { isVisible = false; cancelAnimationFrame(rafId); }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
