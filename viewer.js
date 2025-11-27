// Готовый Viewer из web-ifc-viewer создаётся через глобальный IfcViewerAPI
const container = document.getElementById("three-canvas");

// Инициализация вьюера
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new THREE.Color(0xcccccc)
});

// Указываем путь к wasm (положи web-ifc.wasm рядом с viewer.js)
viewer.IFC.setWasmPath("./");

// URL IFC модели на GitHub (подставь свои repo/файл, регистр важен)
const IFC_URL = "https://cdn.jsdelivr.net/gh/artgarth1-afk/ifc-viewer@main/model.ifc";

// Загружаем модель
viewer.IFC.loadIfcUrl(IFC_URL).then((model) => {
  viewer.context.renderer.postProduction.active = true;
}).catch((err) => {
  console.error("Ошибка загрузки IFC:", err);
});

// Обработка ресайза
window.addEventListener("resize", () => {
  viewer.context.updateSize();
});
