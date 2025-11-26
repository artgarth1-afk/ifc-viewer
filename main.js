const container = document.getElementById('viewer');
const viewer = new IfcViewerAPI({ container, backgroundColor: 0xffffff });

viewer.axes.setAxes();
viewer.grid.setGrid();

// Загружаем ваш файл из корня (рядом с index.html)
viewer.IFC.loadIfcUrl('model.ifc');
