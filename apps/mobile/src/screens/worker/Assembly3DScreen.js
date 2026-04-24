import React, { useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

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

function generateHTML(steps) {
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
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f1f5f9; overflow: hidden; touch-action: none; }
  #canvas-container { width: 100vw; height: 55vh; position: relative; }
  #controls { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; z-index: 10; }
  .ctrl-btn { background: rgba(255,255,255,0.9); border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px; font-size: 11px; font-weight: 600; color: #475569; cursor: pointer; backdrop-filter: blur(8px); }
  .ctrl-btn.active { background: #dbeafe; color: #2563eb; border-color: #93c5fd; }
  #legend { position: absolute; top: 8px; left: 8px; background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); padding: 8px 10px; border-radius: 8px; border: 1px solid #e2e8f0; z-index: 10; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #64748b; margin-bottom: 3px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
  #panel { height: 45vh; overflow-y: auto; padding: 12px; background: #fff; border-top: 1px solid #e2e8f0; }
  .part-btn { width: 100%; text-align: left; padding: 10px 12px; border-radius: 8px; border: 1px solid transparent; margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; gap: 10px; background: #f8fafc; font-size: 13px; }
  .part-btn.selected { background: #eff6ff; border-color: #93c5fd; }
  .part-btn .order { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 4px; font-size: 10px; font-weight: 700; }
  .part-btn .order.done { background: #dcfce7; color: #16a34a; }
  .part-btn .order.pending { background: #f1f5f9; color: #94a3b8; }
  .part-btn .order.active { background: #dbeafe; color: #2563eb; }
  .part-name { font-weight: 500; color: #1e293b; flex: 1; }
  .part-name.done { color: #16a34a; }
  .check { color: #22c55e; font-size: 16px; }
  #detail { margin-top: 8px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; display: none; }
  #detail h4 { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
  #detail ol { padding-left: 20px; }
  #detail li { font-size: 12px; color: #475569; margin-bottom: 4px; line-height: 1.4; }
  #nav { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
  #nav button { font-size: 12px; font-weight: 600; color: #475569; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 14px; cursor: pointer; }
  #nav button:disabled { opacity: 0.3; }
  #nav span { font-size: 11px; color: #94a3b8; font-family: monospace; }
  .progress-bar { height: 4px; background: #e2e8f0; border-radius: 2px; margin-bottom: 8px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #22c55e); border-radius: 2px; transition: width 0.3s; }
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
    <button class="ctrl-btn" id="explodeBtn" onclick="toggleExplode()">Patlama</button>
    <button class="ctrl-btn" onclick="resetView()">↺</button>
  </div>
</div>
<div id="panel">
  <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
  <div id="partList"></div>
  <div id="detail">
    <h4 id="detailTitle"></h4>
    <ol id="detailSteps"></ol>
    <div id="nav">
      <button onclick="navigate(-1)" id="prevBtn">◀ Önceki</button>
      <span id="navCounter"></span>
      <button onclick="navigate(1)" id="nextBtn">Sonraki ▶</button>
    </div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const PARTS = ${JSON.stringify(parts)};
let scene, camera, renderer, meshes = {}, selectedId = null, isExploded = false, autoRotate = true;
let isDragging = false, prevTouch = null, rotX = 0.3, rotY = 0;

function init() {
  const container = document.getElementById('canvas-container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f5f9);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(6, 4, 6);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(5, 8, 5);
  scene.add(dir);
  const dir2 = new THREE.DirectionalLight(0xffffff, 0.3);
  dir2.position.set(-5, 3, -5);
  scene.add(dir2);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.5 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3;
  scene.add(ground);

  // Parts
  const group = new THREE.Group();
  PARTS.forEach(part => {
    let geo;
    if (part.geometry === 'box') geo = new THREE.BoxGeometry(1, 1, 1);
    else if (part.geometry === 'cylinder') geo = new THREE.CylinderGeometry(1, 1, 1, 32);
    else geo = new THREE.SphereGeometry(1, 32, 32);

    const color = part.isCompleted ? part.completedColor : part.color;
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...part.position);
    if (part.rotation) mesh.rotation.set(...part.rotation);
    mesh.scale.set(...part.scale);
    mesh.userData = { partId: part.id };
    meshes[part.id] = mesh;
    group.add(mesh);
  });
  scene.add(group);
  scene.userData.group = group;

  // Touch controls
  const canvas = renderer.domElement;
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('click', onClick);

  renderPartList();
  updateProgress();
  animate();
}

function onTouchStart(e) { e.preventDefault(); isDragging = true; autoRotate = false; prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
function onTouchMove(e) {
  e.preventDefault();
  if (!isDragging || !prevTouch) return;
  const dx = e.touches[0].clientX - prevTouch.x;
  const dy = e.touches[0].clientY - prevTouch.y;
  rotY += dx * 0.01;
  rotX += dy * 0.005;
  rotX = Math.max(-1, Math.min(1, rotX));
  scene.userData.group.rotation.y = rotY;
  prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}
function onTouchEnd(e) {
  isDragging = false;
  if (e.changedTouches && e.changedTouches[0]) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.changedTouches[0].clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.changedTouches[0].clientY - rect.top) / rect.height) * 2 + 1;
    if (Math.abs(e.changedTouches[0].clientX - (prevTouch?.x || 0)) < 10) pickPart(x, y);
  }
}
function onMouseDown(e) { isDragging = true; autoRotate = false; prevTouch = { x: e.clientX, y: e.clientY }; }
function onMouseMove(e) {
  if (!isDragging || !prevTouch) return;
  rotY += (e.clientX - prevTouch.x) * 0.01;
  scene.userData.group.rotation.y = rotY;
  prevTouch = { x: e.clientX, y: e.clientY };
}
function onMouseUp() { isDragging = false; }
function onClick(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  pickPart(x, y);
}

function pickPart(x, y) {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera({ x, y }, camera);
  const group = scene.userData.group;
  const intersects = raycaster.intersectObjects(group.children);
  if (intersects.length > 0) selectPart(intersects[0].object.userData.partId);
}

function selectPart(id) {
  selectedId = id;
  autoRotate = false;
  Object.entries(meshes).forEach(([pid, mesh]) => {
    const part = PARTS.find(p => p.id === pid);
    if (pid === id) {
      mesh.material.color.set('#3b82f6');
      mesh.material.emissive = new THREE.Color('#3b82f6');
      mesh.material.emissiveIntensity = 0.3;
    } else {
      mesh.material.color.set(part.isCompleted ? part.completedColor : part.color);
      mesh.material.emissive = new THREE.Color('#000000');
      mesh.material.emissiveIntensity = 0;
    }
  });
  renderPartList();
  showDetail(id);
}

function toggleExplode() {
  isExploded = !isExploded;
  document.getElementById('explodeBtn').classList.toggle('active', isExploded);
  PARTS.forEach(part => {
    const mesh = meshes[part.id];
    if (isExploded) {
      mesh.position.set(part.position[0] + part.explodedOffset[0], part.position[1] + part.explodedOffset[1], part.position[2] + part.explodedOffset[2]);
    } else {
      mesh.position.set(...part.position);
    }
  });
}

function resetView() {
  selectedId = null; autoRotate = true; isExploded = false;
  document.getElementById('explodeBtn').classList.remove('active');
  scene.userData.group.rotation.y = 0; rotY = 0;
  PARTS.forEach(part => {
    const mesh = meshes[part.id];
    mesh.position.set(...part.position);
    mesh.material.color.set(part.isCompleted ? part.completedColor : part.color);
    mesh.material.emissive = new THREE.Color('#000000');
    mesh.material.emissiveIntensity = 0;
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
    return '<button class="part-btn ' + (sel ? 'selected' : '') + '" onclick="selectPart(\\''+p.id+'\\')"><span class="order '+orderClass+'">'+p.order+'</span><span class="part-name '+nameClass+'">'+p.name+'</span>'+(p.isCompleted ? '<span class="check">✓</span>' : '')+'</button>';
  }).join('');
}

function showDetail(id) {
  const part = PARTS.find(p => p.id === id);
  if (!part) return;
  document.getElementById('detailTitle').textContent = part.order + '. ' + part.name;
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
  document.getElementById('progressFill').style.width = (done / PARTS.length * 100) + '%';
}

function animate() {
  requestAnimationFrame(animate);
  if (autoRotate && scene.userData.group) scene.userData.group.rotation.y += 0.003;
  renderer.render(scene, camera);
}

init();
</script>
</body></html>`;
}

export default function Assembly3DScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const { steps = [], jobTitle = '' } = route.params || {};

  const html = useMemo(() => generateHTML(steps), [steps]);

  const renderViewer = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={{ flex: 1 }}>
          <iframe
            srcDoc={html}
            style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#f1f5f9' }}
            title="3D Assembly Viewer"
          />
        </View>
      );
    }
    // Native: use WebView
    const NativeWebView = require('react-native-webview').WebView;
    return (
      <NativeWebView
        source={{ html }}
        style={{ flex: 1, backgroundColor: '#f1f5f9' }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        scalesPageToFit={false}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>3D Montaj Kılavuzu</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.subText }]} numberOfLines={1}>{jobTitle}</Text>
        </View>
      </View>
      {renderViewer()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backButton: { padding: 4 },
  headerContent: { marginLeft: 12, flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, marginTop: 2 }
});
