/**
 * heroScene.js — Three.js hero WebGL scene
 * Wireframe icospheres, glowing shards, particle field with connections, neon grid
 */
import * as THREE from 'three';

export function initHeroScene() {
  const canvas   = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 18);

  // ── Lighting ──────────────────────────────────────────────
  const ambLight = new THREE.AmbientLight(0x00ffe7, 0.3);
  scene.add(ambLight);
  const ptLight1 = new THREE.PointLight(0x00ffe7, 2, 40);
  ptLight1.position.set(5, 8, 10);
  scene.add(ptLight1);
  const ptLight2 = new THREE.PointLight(0xff00c8, 1.5, 30);
  ptLight2.position.set(-8, -4, 8);
  scene.add(ptLight2);

  // ── Neon Grid Plane ───────────────────────────────────────
  const gridHelper = new THREE.GridHelper(80, 40, 0x00ffe7, 0x003322);
  gridHelper.position.set(0, -6, -10);
  gridHelper.rotation.x = 0.25;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.35;
  scene.add(gridHelper);

  // ── Wireframe Icospheres ──────────────────────────────────
  const spheres = [];
  const icoGeo  = new THREE.IcosahedronGeometry(1, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00ffe7,
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });

  const sphereData = [
    { pos: [-6, 3, -4],  scale: 1.4, speed: 0.009 },
    { pos: [7, -2, -6],  scale: 1.0, speed: 0.006 },
    { pos: [-3, -5, -3], scale: 0.7, speed: 0.013 },
    { pos: [4, 5, -8],   scale: 1.8, speed: 0.005 },
    { pos: [0, 0, -12],  scale: 2.5, speed: 0.003 },
  ];

  sphereData.forEach(({ pos, scale, speed }) => {
    const mesh = new THREE.Mesh(icoGeo, wireMat.clone());
    mesh.position.set(...pos);
    mesh.scale.setScalar(scale);
    mesh.userData = { speed, phase: Math.random() * Math.PI * 2, origPos: [...pos] };
    scene.add(mesh);
    spheres.push(mesh);
  });

  // ── Glowing Geometric Shards ──────────────────────────────
  const shards = [];
  const shardGeos = [
    new THREE.TetrahedronGeometry(0.6),
    new THREE.OctahedronGeometry(0.5),
    new THREE.TetrahedronGeometry(0.4),
  ];
  const shardColors = [0x00ffe7, 0xff00c8, 0xffe600];

  for (let i = 0; i < 18; i++) {
    const geoIdx = i % shardGeos.length;
    const mat    = new THREE.MeshBasicMaterial({
      color: shardColors[i % shardColors.length],
      wireframe: true,
      transparent: true,
      opacity: 0.4 + Math.random() * 0.3,
    });
    const mesh = new THREE.Mesh(shardGeos[geoIdx], mat);
    const rx = (Math.random() - 0.5) * 28;
    const ry = (Math.random() - 0.5) * 16;
    const rz = (Math.random() - 0.5) * 14 - 6;
    mesh.position.set(rx, ry, rz);
    mesh.userData = {
      speed:  0.003 + Math.random() * 0.01,
      phase:  Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.005,
      driftY: (Math.random() - 0.5) * 0.005,
    };
    scene.add(mesh);
    shards.push(mesh);
  }

  // ── Particle Field with Connections ───────────────────────
  const PARTICLE_COUNT = 120;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const partVels  = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4;
    partVels.push({
      x: (Math.random() - 0.5) * 0.015,
      y: (Math.random() - 0.5) * 0.015,
      z: (Math.random() - 0.5) * 0.005,
    });
  }

  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0x00ffe7,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // Line connections geometry
  const linePositions = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: 0x00ffe7, transparent: true, opacity: 0.12 })
  );
  scene.add(lineMat);

  // ── Mouse Tracking ────────────────────────────────────────
  const mouse  = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Mobile gyroscope
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      mouse.x = (e.gamma || 0) / 45;
      mouse.y = (e.beta  || 0) / 90;
    });
  }

  // ── Resize ────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation Loop ────────────────────────────────────────
  let clock = new THREE.Clock();
  const CONNECTION_DIST = 8;

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse tracking
    target.x += (mouse.x - target.x) * 0.04;
    target.y += (mouse.y - target.y) * 0.04;
    camera.position.x = target.x * 2.5;
    camera.position.y = -target.y * 1.5;
    camera.lookAt(scene.position);

    // Rotate spheres + gentle orbit
    spheres.forEach((s) => {
      s.rotation.x += s.userData.speed;
      s.rotation.y += s.userData.speed * 0.7;
      s.position.y = s.userData.origPos[1] + Math.sin(t * 0.4 + s.userData.phase) * 0.6;
      s.position.x = s.userData.origPos[0] + Math.cos(t * 0.3 + s.userData.phase) * 0.4;
    });

    // Drift shards
    shards.forEach((sh) => {
      sh.rotation.x += sh.userData.speed;
      sh.rotation.y += sh.userData.speed * 1.3;
      sh.rotation.z += sh.userData.speed * 0.8;
      sh.position.y += Math.sin(t + sh.userData.phase) * 0.005;
      sh.position.x += sh.userData.driftX;
      sh.position.y += sh.userData.driftY;
      // Wrap
      if (sh.position.x > 15) sh.position.x = -15;
      if (sh.position.x < -15) sh.position.x = 15;
      if (sh.position.y > 9) sh.position.y = -9;
      if (sh.position.y < -9) sh.position.y = 9;
    });

    // Move particles + rebuild connections
    const pos = partGeo.attributes.position.array;
    let lineIdx = 0;
    const lpos  = lineGeo.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i*3]     += partVels[i].x;
      pos[i*3 + 1] += partVels[i].y;
      pos[i*3 + 2] += partVels[i].z;
      // Bounce
      if (Math.abs(pos[i*3])     > 20) partVels[i].x *= -1;
      if (Math.abs(pos[i*3 + 1]) > 12) partVels[i].y *= -1;
      if (Math.abs(pos[i*3 + 2]) > 10) partVels[i].z *= -1;
    }
    partGeo.attributes.position.needsUpdate = true;

    // Connect nearby particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = pos[i*3] - pos[j*3];
        const dy = pos[i*3+1] - pos[j*3+1];
        const dz = pos[i*3+2] - pos[j*3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < CONNECTION_DIST && lineIdx + 5 < lpos.length) {
          lpos[lineIdx++] = pos[i*3];
          lpos[lineIdx++] = pos[i*3+1];
          lpos[lineIdx++] = pos[i*3+2];
          lpos[lineIdx++] = pos[j*3];
          lpos[lineIdx++] = pos[j*3+1];
          lpos[lineIdx++] = pos[j*3+2];
        }
      }
    }
    // Clear rest
    for (let k = lineIdx; k < lpos.length; k++) lpos[k] = 0;
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx / 3);

    // Mouse-reactive particle scatter
    const mx = (mouse.x * 20);
    const my = (-mouse.y * 12);
    for (let i = 0; i < PARTICLE_COUNT; i += 4) {
      const dx = pos[i*3] - mx;
      const dy = pos[i*3+1] - my;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 4) {
        partVels[i].x += (dx / d) * 0.02;
        partVels[i].y += (dy / d) * 0.02;
      }
    }

    // Pulse grid
    gridHelper.position.y = -6 + Math.sin(t * 0.3) * 0.3;
    gridHelper.material.opacity = 0.25 + Math.sin(t * 0.5) * 0.1;

    renderer.render(scene, camera);
  }
  animate();

  return { scene, camera, renderer };
}
