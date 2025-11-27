// Проверка, что глобальный объект есть
console.log("IfcViewerAPI global:", window.IfcViewerAPI);

// Берём canvas как контейнер
const container = document.getElementById("three-canvas");

// Инициализация вьюера
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new THREE.Color(0xcccccc)
});

// Путь к wasm (положи web-ifc.wasm рядом с viewer.js или поправь путь)
viewer.IFC.setWasmPath("./");

// URL IFC модели (замени, если другое имя)
const IFC_URL = "https://cdn.jsdelivr.net/gh/artgarth1-afk/ifc-viewer@main/model.ifc";

// Загрузка модели
viewer.IFC.loadIfcUrl(IFC_URL)
  .then(() => {
    viewer.context.renderer.postProduction.active = true;
  })
  .catch((err) => {
    console.error("Ошибка загрузки IFC:", err);
  });

// Ресайз
window.addEventListener("resize", () => {
  viewer.context.updateSize();
});
