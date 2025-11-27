// Ждём, когда загрузятся все библиотеки
function waitForLibraries() {
  if (!window.THREE || !window.WebIFCThree) {
    setTimeout(waitForLibraries, 100);
    return;
  }

  console.log("Все библиотеки загружены:", window.WebIFCThree);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);

  const size = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const aspect = size.width / size.height;
  const camera = new THREE.PerspectiveCamera(75, aspect);
  camera.position.set(8, 13, 15);

  const lightColor = 0xffffff;
  const ambientLight = new THREE.AmbientLight(lightColor, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(lightColor, 1);
  directionalLight.position.set(0, 10, 0);
  directionalLight.target.position.set(-5, 0, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  const canvas = document.getElementById("three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const grid = new THREE.GridHelper(50, 30);
  scene.add(grid);

  const axes = new THREE.AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  scene.add(axes);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.target.set(-2, 0, 0);

  const ifcLoader = new window.WebIFCThree.IFCLoader();
  ifcLoader.ifcManager.setWasmPath("./");

  const IFC_URL = "https://cdn.jsdelivr.net/gh/artgarth1-afk/ifc-viewer@main/model.ifc";

  ifcLoader.load(
    IFC_URL,
    (ifcModel) => {
      const obj = ifcModel.mesh || ifcModel;
      scene.add(obj);

      const box = new THREE.Box3().setFromObject(obj);
      const sizeBox = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxSize = Math.max(sizeBox.x, sizeBox.y, sizeBox.z) || 1;
      const distance = maxSize * 2;

      camera.position.set(center.x + distance, center.y + distance, center.z + distance);
      controls.target.copy(center);
      controls.update();
    },
    undefined,
    (err) => {
      console.error("Ошибка загрузки IFC:", err);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
  });
}

// Запусти проверку
waitForLibraries();
