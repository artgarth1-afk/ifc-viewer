// Импортируем xeokit и web-ifc
import { Viewer, WebIFCLoaderPlugin } from "./xeokit-sdk.es.js";
import * as WebIFCModule from "./web-ifc-api.js";

// Важный момент: передаём в xeokit весь модуль web-ifc, а не свойство .WebIFC
const WebIFCConstructor = WebIFCModule;

// 1. Создаём Viewer
const viewer = new Viewer({
  canvasId: "myCanvas",
  transparent: true
});

// Начальная позиция камеры (можете потом подправить под свою модель)
viewer.camera.eye = [-3.93, 2.85, 27.01];
viewer.camera.look = [4.4, 3.72, 8.89];
viewer.camera.up = [-0.01, 0.99, 0.039];

// 2. Подключаем WebIFCLoaderPlugin
const ifcLoader = new WebIFCLoaderPlugin(viewer, {
  // Путь к web-ifc.wasm относительно этого файла (docs/web-ifc.wasm)
  wasmPath: "./",
  // Сюда передаём модуль web-ifc
  webIFC: WebIFCConstructor
});

// 3. Загружаем единственную модель из docs/model.ifc
const model = ifcLoader.load({
  id: "myModel",
  src: "./model.ifc",
  edges: true
});

// 4. Обработка событий загрузки
model.on("loaded", () => {
  console.log("Модель успешно загружена!");

  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";

  // Летим камерой к модели, чтобы она целиком попала в кадр
  viewer.cameraFlight.flyTo(model);
});

model.on("error", (error) => {
  console.error("Ошибка при загрузке модели:", error);

  const loader = document.getElementById("loader");
  if (loader) {
    loader.innerText = "Ошибка загрузки! Проверьте консоль (F12)";
    loader.style.color =
