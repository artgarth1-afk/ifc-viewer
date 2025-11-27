import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IFCLoader } from "web-ifc-three/IFCLoader";

// 1. Сцена
const scene = new Scene();

// 2. Размеры
const size = {
  width: window.innerWidth,
  height: window.innerHeight
};

// 3. Камера
const aspect = size.width / size.height;
const camera = new PerspectiveCamera(75, aspect);
camera.position.set(8, 13, 15);

// 4. Свет
const lightColor = 0xffffff;
const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

// 5. Рендерер
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({
  canvas: threeCanvas,
  alpha: true,
  antialias: true
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 6. Сетка и оси (для ориентира)
const grid = new GridHelper(50, 30);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

// 7. OrbitControls
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

// 8. IFC Loader
const ifcLoader = new IFCLoader();

// Путь к web-ifc.wasm (лежит рядом с bundle.js)
ifcLoader.ifcManager.setWasmPath("./");

// URL до IFC модели на GitHub Pages
// Замените artgarth1-afk/ifc-viewer и model.ifc под ваш репозиторий/имя файла
const IFC_URL = "https://cdn.jsdelivr.net/gh/artgarth1-afk/ifc-viewer@main/model.ifc";

// Загрузка модели по URL (без input)
ifcLoader.load(IFC_URL, (ifcModel) => {
  scene.add(ifcModel);

  // Немного авто-кадра
  const box = new THREE.Box3().setFromObject(ifcModel);
  const sizeBox = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxSize = Math.max(sizeBox.x, sizeBox.y, sizeBox.z);
  const distance = maxSize * 2;

  camera.position.set(center.x + distance, center.y + distance, center.z + distance);
  controls.target.copy(center);
  controls.update();
});

// 9. Анимация
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

// 10. Ресайз
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
