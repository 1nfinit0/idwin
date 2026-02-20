import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function init3DViewer(container) {
  const renders = JSON.parse(container.dataset.renders);

  let scene, camera, renderer, currentModel;
  let currentIndex = 0;

  function initScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(light);

    animate();
  }

  function loadModel(index) {
    const loader = new GLTFLoader();

    if (currentModel) {
      scene.remove(currentModel);
    }

    loader.load(renders[index].renderUrl, (gltf) => {
      currentModel = gltf.scene;
      scene.add(currentModel);
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  function nextModel() {
    currentIndex = (currentIndex + 1) % renders.length;
    loadModel(currentIndex);
  }

  function prevModel() {
    currentIndex =
      (currentIndex - 1 + renders.length) % renders.length;
    loadModel(currentIndex);
  }

  initScene();
  loadModel(currentIndex);

  return { nextModel, prevModel };
}