import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Mesh,
  BoxGeometry,
  MeshNormalMaterial
} from "three";
import { resizeRendererToDisplaySize, resizeCameraToRenderSize } from "./utils";

const { renderer, scene, camera } = init();
animate();

function init() {
  const canvas = document.querySelector("#c");
  const renderer = new WebGLRenderer({ canvas });

  const scene = new Scene();

  const camera = new PerspectiveCamera(75, 2, 0.1, 2000);
  camera.position.set(0, 2, 5);
  scene.add(camera);

  scene.add(new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial()));

  return { renderer, scene, camera };
}

function animate() {
  if (resizeRendererToDisplaySize(renderer)) {
    resizeCameraToRenderSize(renderer, camera);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
