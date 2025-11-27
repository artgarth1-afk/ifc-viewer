// Импорт библиотек
import { Viewer, WebIFCLoaderPlugin } from "./xeokit-sdk.es.js";
import * as WebIFCModule from "./web-ifc-api.js";

// Берём конструктор WebIFC из модуля web-ifc
const WebIFCConstructor = WebIFCModule.WebIFC;

// 1. Создаём Viewer
const viewer = new Viewer({
  canvasId: "myCanvas",
  transparent: true
});

// Начальная позиция камеры (можно потом подправить под модель)
viewer.camera.eye = [-3.93, 2.85, 27.01];
viewer.camera.look = [4.4, 3.72, 8.89];
viewer.camera.up = [-0.01, 0.99, 0.039];

// 2. Подключаем WebIFCLoaderPlugin
const ifcLoader = new WebIFCLoaderPlugin(viewer, {
  wasmPath: "./",          // web-ifc.wasm лежит в docs рядом с этим файлом
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

  // Летим камерой к модели
  viewer.cameraFlight.flyTo(model);
});

model.on("error", (error) => {
  console.error("Ошибка при загрузке модели:", error);
  const loader = document.getElementById("loader");
  if (loader) {
    loader.innerText = "Ошибка загрузки! Проверьте консоль (F12)";
    loader.style.color = "red";
  }
});
