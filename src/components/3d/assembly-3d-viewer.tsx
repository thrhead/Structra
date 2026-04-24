'use client'

import { useMemo } from 'react'

const MOCK_PARTS = [
    { id: 'mounting-plate', name: 'Montaj Sacı', color: '#94a3b8', completedColor: '#22c55e', position: [0, 2.5, -0.5], scale: [3, 0.1, 0.8], geometry: 'box', order: 1, explodedOffset: [0, 1.5, -2], instructions: ['Montaj sacını duvara tutun ve su terazisi ile hizalayın', 'İşaretleme noktalarını belirleyin', 'Dübel delikleri açın (8mm)', 'Sacı 4 adet M8 dübel ile sabitleyin'] },
    { id: 'indoor-unit-body', name: 'İç Ünite Gövdesi', color: '#f8fafc', completedColor: '#22c55e', position: [0, 2.5, 0], scale: [3.2, 0.9, 0.7], geometry: 'box', order: 2, explodedOffset: [0, 1.5, 2], instructions: ['İç üniteyi montaj sacına asın', 'Alt kilitleme tırnaklarını oturtun', 'Drenaj hortumunu bağlayın', 'Elektrik bağlantısını yapın'] },
    { id: 'indoor-filter', name: 'İç Ünite Filtresi', color: '#e2e8f0', completedColor: '#22c55e', position: [0, 2.35, 0.3], rotation: [0.15, 0, 0], scale: [2.8, 0.05, 0.5], geometry: 'box', order: 3, explodedOffset: [0, 0, 3], instructions: ['Ön kapağı açın', 'Filtreleri ray boyunca kaydırın', 'Tam oturduğundan emin olun'] },
    { id: 'copper-pipe', name: 'Bakır Boru Hattı', color: '#d97706', completedColor: '#22c55e', position: [1.8, 1.2, 0], rotation: [0, 0, 0.785], scale: [0.08, 2.5, 0.08], geometry: 'cylinder', order: 4, explodedOffset: [3, 0, 0], instructions: ['Bakır boruları duvar deliğinden geçirin', 'Flare somunlarını tork anahtarı ile sıkın', 'Vakum pompası ile sistemi vakumlayın', 'Kaçak testi yapın'] },
    { id: 'outdoor-unit', name: 'Dış Ünite', color: '#cbd5e1', completedColor: '#22c55e', position: [0, -1.5, 0], scale: [2.5, 2, 1.2], geometry: 'box', order: 5, explodedOffset: [0, -3, 0], instructions: ['Dış ünite konsolunu sabitleyin', 'Dış üniteyi konsola yerleştirin', 'Titreşim padlerini takın', 'Bakır boru bağlantılarını yapın'] },
    { id: 'outdoor-fan', name: 'Dış Ünite Fanı', color: '#64748b', completedColor: '#22c55e', position: [0, -1.5, 0.65], rotation: [1.5708, 0, 0], scale: [0.7, 0.1, 0.7], geometry: 'cylinder', order: 6, explodedOffset: [0, 0, 3], instructions: ['Fan pervanelerini kontrol edin', 'Motor bağlantılarını kontrol edin', 'Manuel döndürerek test edin'] },
    { id: 'electrical-cable', name: 'Elektrik Kablosu', color: '#1e293b', completedColor: '#22c55e', position: [-1.5, 0.5, 0], scale: [0.05, 3.5, 0.05], geometry: 'cylinder', order: 7, explodedOffset: [-3, 0, 0], instructions: ['Ana sigortayı kapatın', 'Kablo kanalını döşeyin', 'İç/dış ünite bağlantıları yapın', 'Topraklama kablosunu bağlayın'] },
    { id: 'test-run', name: 'Test Çalıştırması', color: '#fbbf24', completedColor: '#22c55e', position: [0, 0.5, 2], scale: [0.4, 0.4, 0.4], geometry: 'sphere', order: 8, explodedOffset: [0, 0, 3], instructions: ['Soğutma modunda çalıştırın', 'Çıkış sıcaklığını ölçün', 'Isıtma modunu test edin', 'Uzaktan kumanda kontrolü'] }
];

function generateHTML(steps: any[]) {
    const parts = MOCK_PARTS.map((part, idx) => {
        const step = steps[idx];
        return { ...part, isCompleted: step?.isCompleted || false };
    });

    return `
<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f1f5f9; overflow: auto; display: flex; height: 100vh; }
  #canvas-container { width: 66%; height: 100%; position: relative; }
  #panel { width: 34%; height: 100%; overflow-y: auto; padding: 16px; background: #fff; border-left: 1px solid #e2e8f0; display: flex; flex-direction: column; }
  
  @media (max-width: 768px) {
    body { flex-direction: column; }
    #canvas-container { width: 100%; height: 50vh; }
    #panel { width: 100%; height: 50vh; border-left: none; border-top: 1px solid #e2e8f0; }
  }

  #controls { position: absolute; top: 12px; right: 12px; display: flex; gap: 8px; z-index: 10; }
  .ctrl-btn { background: rgba(255,255,255,0.9); border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; backdrop-filter: blur(8px); transition: all 0.2s; }
  .ctrl-btn:hover { background: #f8fafc; }
  .ctrl-btn.active { background: #dbeafe; color: #2563eb; border-color: #93c5fd; }
  
  #legend { position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; z-index: 10; }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 6px; }
  .legend-item:last-child { margin-bottom: 0; }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
  
  .part-btn { width: 100%; text-align: left; padding: 12px 14px; border-radius: 8px; border: 1px solid transparent; margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; background: #f8fafc; font-size: 14px; transition: all 0.2s; }
  .part-btn:hover { background: #f1f5f9; }
  .part-btn.selected { background: #eff6ff; border-color: #bfdbfe; }
  .part-btn .order { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; font-size: 11px; font-weight: 700; }
  .part-btn .order.done { background: #dcfce7; color: #16a34a; }
  .part-btn .order.pending { background: #e2e8f0; color: #64748b; }
  .part-btn .order.active { background: #dbeafe; color: #2563eb; }
  .part-name { font-weight: 600; color: #334155; flex: 1; }
  .part-name.done { color: #16a34a; }
  .check { color: #22c55e; font-size: 18px; }
  
  #detail { margin-top: auto; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; display: none; }
  #detail h4 { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  #detail ol { padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  #detail li { font-size: 13px; color: #475569; line-height: 1.5; display: flex; gap: 8px; }
  #detail li::before { content: "•"; color: #3b82f6; font-weight: bold; }
  
  #nav { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #e2e8f0; }
  #nav button { font-size: 13px; font-weight: 600; color: #475569; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 16px; cursor: pointer; transition: all 0.2s; }
  #nav button:hover:not(:disabled) { background: #f1f5f9; color: #1e293b; }
  #nav button:disabled { opacity: 0.4; cursor: not-allowed; }
  #nav span { font-size: 12px; font-weight: 500; color: #94a3b8; font-variant-numeric: tabular-nums; }
  
  .progress-container { margin-bottom: 16px; }
  .progress-header { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 8px; }
  .progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); border-radius: 3px; transition: width 0.4s ease-out; }
</style>
</head>
<body>

<div id="canvas-container">
  <div id="legend">
    <div class="legend-item"><div class="legend-dot" style="background:#22c55e"></div>Tamamlandı</div>
    <div class="legend-item"><div class="legend-dot" style="background:#3b82f6"></div>Seçili</div>
    <div class="legend-item"><div class="legend-dot" style="background:#94a3b8"></div>Bekliyor</div>
  </div>
  <div id="controls">
    <button class="ctrl-btn" id="explodeBtn" onclick="toggleExplode()">Patlama Görünümü</button>
    <button class="ctrl-btn" onclick="resetView()" title="Görünümü Sıfırla">↺ Sıfırla</button>
  </div>
</div>

<div id="panel">
  <div class="progress-container">
    <div class="progress-header">
      <span>Genel İlerleme</span>
      <span id="progressText">0%</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width: 0%"></div></div>
  </div>
  
  <div id="partList" style="flex: 1; overflow-y: auto; margin-bottom: 16px; padding-right: 4px;"></div>
  
  <div id="detail">
    <h4 id="detailTitle"></h4>
    <ol id="detailSteps"></ol>
    <div id="nav">
      <button onclick="navigate(-1)" id="prevBtn">Önceki</button>
      <span id="navCounter"></span>
      <button onclick="navigate(1)" id="nextBtn">Sonraki</button>
    </div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const PARTS = ${JSON.stringify(parts)};
let scene, camera, renderer, meshes = {}, selectedId = null, isExploded = false, autoRotate = true;
let isDragging = false, prevMouse = null, rotX = 0.3, rotY = 0;

function init() {
  const container = document.getElementById('canvas-container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f5f9);

  // Soft fog
  scene.fog = new THREE.Fog(0xf1f5f9, 10, 30);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(7, 5, 8);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 10, 5);
  dir.castShadow = true;
  dir.shadow.camera.top = 5;
  dir.shadow.camera.bottom = -5;
  dir.shadow.camera.left = -5;
  dir.shadow.camera.right = 5;
  dir.shadow.mapSize.width = 1024;
  dir.shadow.mapSize.height = 1024;
  scene.add(dir);
  
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-5, 3, -5);
  scene.add(fill);

  // Ground shadow receiver
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.1 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3.5;
  ground.receiveShadow = true;
  scene.add(ground);

  // Parts
  const group = new THREE.Group();
  PARTS.forEach(part => {
    let geo;
    if (part.geometry === 'box') geo = new THREE.BoxGeometry(1, 1, 1);
    else if (part.geometry === 'cylinder') geo = new THREE.CylinderGeometry(1, 1, 1, 32);
    else geo = new THREE.SphereGeometry(1, 32, 32);

    const color = part.isCompleted ? part.completedColor : part.color;
    const mat = new THREE.MeshStandardMaterial({ 
      color, 
      roughness: 0.4, 
      metalness: 0.2,
      transparent: !part.isCompleted,
      opacity: part.isCompleted ? 1 : 0.9
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...part.position);
    if (part.rotation) mesh.rotation.set(...part.rotation);
    mesh.scale.set(...part.scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { partId: part.id };
    meshes[part.id] = mesh;
    group.add(mesh);
  });
  
  // Center group slightly
  group.position.y = 0.5;
  scene.add(group);
  scene.userData.group = group;

  // Interaction events
  const canvas = renderer.domElement;
  
  // Touch
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDragging = true; autoRotate = false; prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDragging || !prevMouse) return;
    rotY += (e.touches[0].clientX - prevMouse.x) * 0.01;
    scene.userData.group.rotation.y = rotY;
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: false });
  canvas.addEventListener('touchend', (e) => {
    isDragging = false;
    if (e.changedTouches && e.changedTouches[0]) {
      checkIntersect(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  });

  // Mouse
  canvas.addEventListener('mousedown', (e) => { isDragging = true; autoRotate = false; prevMouse = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || !prevMouse) {
      // Hover effect
      checkHover(e.clientX, e.clientY);
      return;
    }
    rotY += (e.clientX - prevMouse.x) * 0.01;
    scene.userData.group.rotation.y = rotY;
    prevMouse = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('click', (e) => checkIntersect(e.clientX, e.clientY));
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.y += e.deltaY * 0.01;
    camera.position.z += e.deltaY * 0.01;
    camera.position.y = Math.max(2, Math.min(12, camera.position.y));
    camera.position.z = Math.max(3, Math.min(15, camera.position.z));
    camera.lookAt(0, 0, 0);
  }, { passive: false });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  renderPartList();
  updateProgress();
  animate();
}

function getIntersect(clientX, clientY) {
  const container = document.getElementById('canvas-container');
  const rect = container.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera({ x, y }, camera);
  const intersects = raycaster.intersectObjects(scene.userData.group.children);
  return intersects.length > 0 ? intersects[0].object : null;
}

function checkHover(x, y) {
  const obj = getIntersect(x, y);
  document.body.style.cursor = obj ? 'pointer' : 'default';
}

function checkIntersect(x, y) {
  const obj = getIntersect(x, y);
  if (obj) selectPart(obj.userData.partId);
}

function selectPart(id) {
  selectedId = id;
  autoRotate = false;
  
  // Highlight 3D part
  Object.entries(meshes).forEach(([pid, mesh]) => {
    const part = PARTS.find(p => p.id === pid);
    if (pid === id) {
      mesh.material.color.set('#3b82f6');
      mesh.material.emissive = new THREE.Color('#3b82f6');
      mesh.material.emissiveIntensity = 0.4;
      mesh.material.opacity = 1;
    } else {
      mesh.material.color.set(part.isCompleted ? part.completedColor : part.color);
      mesh.material.emissiveIntensity = 0;
      mesh.material.opacity = part.isCompleted ? 1 : 0.6; // Fade out others
    }
  });

  renderPartList();
  showDetail(id);
  
  // Scroll list to item
  const btn = document.getElementById('btn-' + id);
  if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleExplode() {
  isExploded = !isExploded;
  document.getElementById('explodeBtn').classList.toggle('active', isExploded);
  
  // Simple animation loop for explosion
  let progress = 0;
  const targetScale = isExploded ? 1 : 0;
  const startScale = isExploded ? 0 : 1;
  
  function animateExplode() {
    progress += 0.05;
    if (progress > 1) progress = 1;
    
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = startScale + (targetScale - startScale) * ease;
    
    PARTS.forEach(part => {
      const mesh = meshes[part.id];
      mesh.position.set(
        part.position[0] + (part.explodedOffset[0] * current),
        part.position[1] + (part.explodedOffset[1] * current),
        part.position[2] + (part.explodedOffset[2] * current)
      );
    });
    
    if (progress < 1) requestAnimationFrame(animateExplode);
  }
  
  animateExplode();
}

function resetView() {
  selectedId = null; 
  autoRotate = true; 
  isExploded = false;
  
  document.getElementById('explodeBtn').classList.remove('active');
  scene.userData.group.rotation.y = 0; 
  rotY = 0;
  
  camera.position.set(7, 5, 8);
  camera.lookAt(0, 0, 0);
  
  PARTS.forEach(part => {
    const mesh = meshes[part.id];
    mesh.position.set(...part.position);
    mesh.material.color.set(part.isCompleted ? part.completedColor : part.color);
    mesh.material.emissiveIntensity = 0;
    mesh.material.opacity = part.isCompleted ? 1 : 0.9;
  });
  
  renderPartList();
  document.getElementById('detail').style.display = 'none';
}

function renderPartList() {
  const list = document.getElementById('partList');
  list.innerHTML = PARTS.sort((a, b) => a.order - b.order).map(p => {
    const sel = selectedId === p.id;
    const orderClass = p.isCompleted ? 'done' : sel ? 'active' : 'pending';
    const nameClass = p.isCompleted ? 'done' : '';
    return '<button id="btn-'+p.id+'" class="part-btn ' + (sel ? 'selected' : '') + '" onclick="selectPart(\\''+p.id+'\\')"><span class="order '+orderClass+'">'+p.order+'</span><span class="part-name '+nameClass+'">'+p.name+'</span>'+(p.isCompleted ? '<span class="check">✓</span>' : '')+'</button>';
  }).join('');
}

function showDetail(id) {
  const part = PARTS.find(p => p.id === id);
  if (!part) return;
  
  document.getElementById('detailTitle').innerHTML = '<span style="background:#e0e7ff;color:#4338ca;padding:2px 8px;border-radius:4px;font-size:12px;">Adım '+part.order+'</span> ' + part.name;
  
  const ol = document.getElementById('detailSteps');
  ol.innerHTML = part.instructions.map(i => '<li>' + i + '</li>').join('');
  
  const idx = PARTS.findIndex(p => p.id === id);
  document.getElementById('prevBtn').disabled = idx <= 0;
  document.getElementById('nextBtn').disabled = idx >= PARTS.length - 1;
  document.getElementById('navCounter').textContent = (idx + 1) + ' / ' + PARTS.length;
  
  document.getElementById('detail').style.display = 'block';
}

function navigate(dir) {
  const idx = PARTS.findIndex(p => p.id === selectedId);
  const newIdx = idx + dir;
  if (newIdx >= 0 && newIdx < PARTS.length) selectPart(PARTS[newIdx].id);
}

function updateProgress() {
  const done = PARTS.filter(p => p.isCompleted).length;
  const pct = Math.round((done / PARTS.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = pct + '% (' + done + '/' + PARTS.length + ')';
}

function animate() {
  requestAnimationFrame(animate);
  if (autoRotate && scene.userData.group) scene.userData.group.rotation.y += 0.002;
  renderer.render(scene, camera);
}

// Add load event listener to ensure DOM is ready
window.addEventListener('load', init);
</script>
</body></html>
`;
}

interface Assembly3DViewerProps {
    steps: any[]
    jobTitle: string
}

export function Assembly3DViewer({ steps, jobTitle }: Assembly3DViewerProps) {
    // Generate the HTML for the iframe
    const html = useMemo(() => generateHTML(steps || []), [steps]);

    return (
        <div className="w-full h-[600px] rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
            <iframe
                srcDoc={html}
                title={`3D Assembly Guide - ${jobTitle}`}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    )
}

