import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function initTest3D(container, models, updateUI) {

  /* ==============================
     1️⃣ SETUP BASE
  ============================== */

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 2.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  container.appendChild(renderer.domElement);

  /* ==============================
     2️⃣ HDRI (REFLEXIONES REALISTAS)
  ============================== */

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader()
    .setPath("/hdri/")
    .load("ferndale_studio_04_1k.hdr", (texture) => {

      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      scene.environment = envMap;
      scene.background = null;

      texture.dispose();
      pmremGenerator.dispose();
    });

  /* ==============================
     3️⃣ CONTROLES
  ============================== */

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;

  /* ==============================
     4️⃣ LUCES
  ============================== */

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const frontLight = new THREE.DirectionalLight(0xffffff, 1.4);
  frontLight.position.set(0, 0, 3);
  scene.add(frontLight);

  const sideLight = new THREE.DirectionalLight(0xffffff, 0.6);
  sideLight.position.set(3, 2, 2);
  scene.add(sideLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
  rimLight.position.set(-3, 2, -2);
  scene.add(rimLight);

  /* ==============================
     5️⃣ CAROUSEL + PRECARGA
  ============================== */

  const loader = new GLTFLoader();
  const loadedModels = [];

  let currentModel = null;
  let currentIndex = 0;
  let isAnimating = false;

  // 🔥 PRECARGAR TODOS LOS MODELOS
  async function preloadModels() {

    const promises = models.map((item) => {
      return new Promise((resolve, reject) => {
        loader.load(
          item.model,
          (gltf) => resolve(gltf.scene),
          undefined,
          reject
        );
      });
    });

    const scenes = await Promise.all(promises);

    scenes.forEach((sceneModel, i) => {

      // centrar y escalar UNA SOLA VEZ
      const box = new THREE.Box3().setFromObject(sceneModel);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      sceneModel.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      sceneModel.scale.setScalar(2 / maxDim);

      loadedModels[i] = sceneModel;
    });

    console.log("✅ Todos los modelos precargados");
  }

  function loadModel(index, direction = 1) {

    if (isAnimating) return;
    isAnimating = true;

    // 🔥 CLONAR DESDE MEMORIA (NO CARGAR DE NUEVO)
    const newModel = loadedModels[index].clone(true);

    newModel.position.x = direction * 3;
    scene.add(newModel);

    const duration = 0.6;
    let startTime = performance.now();

    function animateTransition(time) {

      let elapsed = (time - startTime) / 1000;
      let t = Math.min(elapsed / duration, 1);

      t = 1 - Math.pow(1 - t, 3);

      newModel.position.x = direction * (3 * (1 - t));

      if (currentModel) {
        currentModel.position.x = -direction * (3 * t);
      }

      if (t < 1) {
        requestAnimationFrame(animateTransition);
      } else {

        if (currentModel) {
          scene.remove(currentModel);
        }

        currentModel = newModel;
        isAnimating = false;

        // 🔥 actualizar UI SOLO cuando termina transición
        if (updateUI) {
          updateUI(index);
        }
      }
    }

    requestAnimationFrame(animateTransition);
  }

  function nextModel() {
    if (isAnimating) return;
    currentIndex = (currentIndex + 1) % models.length;
    loadModel(currentIndex, 1);
  }

  function prevModel() {
    if (isAnimating) return;
    currentIndex = (currentIndex - 1 + models.length) % models.length;
    loadModel(currentIndex, -1);
  }

  /* ==============================
     6️⃣ BOTONES
  ============================== */

  container.querySelector("#nextBtn")
    ?.addEventListener("click", nextModel);

  container.querySelector("#prevBtn")
    ?.addEventListener("click", prevModel);

  /* ==============================
     7️⃣ LOOP
  ============================== */

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  /* ==============================
     8️⃣ INICIO REAL
  ============================== */

  (async () => {
    await preloadModels();
    loadModel(currentIndex, 1);
    if (updateUI) updateUI(currentIndex);
  })();

  /* ==============================
     9️⃣ RESPONSIVE
  ============================== */

  window.addEventListener("resize", () => {
    camera.aspect =
      container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );
  });
} 