// Импорт библиотек
// 1. Импортируем Viewer и WebIFCLoaderPlugin из Xeokit
import { Viewer, WebIFCLoaderPlugin } from "./xeokit-sdk.es.js";

// 2. Импортируем модуль полностью как объект (WebIFCModule).
import * as WebIFCModule from "./web-ifc-api.js"; 

// ----------------------------------------------------------------------------------
// --- КРИТИЧЕСКИ ВАЖНЫЙ КОД ---
// Эта строка выведет в консоль объект, который вы получили при импорте.
// Нам нужно знать, какое свойство содержит класс WebIFC.
console.log("Импортированный WebIFCModule:", WebIFCModule);
// -----------------------------
// Мы пробуем самое логичное свойство:
const WebIFCConstructor = WebIFCModule.WebIFC;

// 1. Инициализация Viewer (сцена)
const viewer = new Viewer({
    canvasId: "myCanvas",
    transparent: true
});

// Настройка начальной позиции камеры
viewer.camera.eye = [-3.93, 2.85, 27.01];
viewer.camera.look = [4.40, 3.72, 8.89];
viewer.camera.up = [-0.01, 0.99, 0.039];


// 2. Настройка загрузчика IFC
// Передаем извлеченный конструктор
const ifcLoader = new WebIFCLoaderPlugin(viewer, {
    wasmPath: "./",       // Путь к файлу .wasm (должен лежать рядом)
    
    // Передаем конструктор класса WebIFC
    webIFC: WebIFCConstructor 
});


// 3. Загрузка модели
const model = ifcLoader.load({
    id: "myModel",
    src: "./model.ifc",   // Имя вашего файла
    edges: true           // Показывать грани
});


// 4. События загрузки
model.on("loaded", () => {
    console.log("Модель успешно загружена!");
    
    // Скрываем спиннер
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";

    // Плавно летим камерой к модели, чтобы её было видно целиком
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
