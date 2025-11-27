// Импортируем Viewer и загрузчик IFC из вашего файла xeokit
import { Viewer, WebIFCLoaderPlugin } from "./xeokit-sdk.es.js";

// 1. Создаем сцену (Viewer)
const viewer = new Viewer({
    canvasId: "myCanvas",
    transparent: true
});

// Настройка камеры (чтобы вращалась удобно для BIM)
viewer.camera.eye = [-3.93, 2.85, 27.01];
viewer.camera.look = [4.40, 3.72, 8.89];
viewer.camera.up = [-0.01, 0.99, 0.039];

// 2. Настраиваем загрузчик IFC
const ifcLoader = new WebIFCLoaderPlugin(viewer, {
    // Путь к WASM файлу (очень важно, без него не заработает парсер)
    wasmPath: "./" 
});

// 3. Загружаем конкретный файл
const model = ifcLoader.load({
    id: "myModel",
    src: "./model.ifc", // Жесткая ссылка на ваш файл
    edges: true,        // Отображать грани (красивее)
});

// 4. Когда модель загрузится — убираем надпись и фокусируемся
model.on("loaded", () => {
    const loaderElement = document.getElementById("loader");
    if(loaderElement) loaderElement.style.display = "none";
    
    // Автоматически полететь камерой к модели
    viewer.cameraFlight.flyTo(model);
});

// Обработка ошибок
model.on("error", (e) => {
    console.error("Ошибка загрузки:", e);
    document.getElementById("loader").innerText = "Ошибка загрузки!";
});
