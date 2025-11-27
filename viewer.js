function waitForLibraries() {
  if (!window.THREE) {
    setTimeout(waitForLibraries, 100);
    return;
  }

  console.log("THREE загружен");

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
    canvas: canvas,
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

  // Тестовый куб
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const box = new THREE.Box3().setFromObject(mesh);
  const sizeBox = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxSize = Math.max(sizeBox.x, sizeBox.y, sizeBox.z) || 1;
  const distance = maxSize * 2;

  camera.position.set(center.x + distance, center.y + distance, center.z + distance);
  controls.target.copy(center);
  controls.update();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", function() {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
  });
}

waitForLibraries();
