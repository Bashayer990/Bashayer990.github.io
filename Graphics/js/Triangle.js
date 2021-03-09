
var scene = new THREE.Scene();

function createTriangle(v1, v2, v3) {
  
var mat = new THREE.LineBasicMaterial({ color: "yellow" });

  var geom = new THREE.Geometry();
  geom.vertices.push(new THREE.Vector3(...[...v1, 1]));
  geom.vertices.push(new THREE.Vector3(...[...v2, 1]));
  geom.vertices.push(new THREE.Vector3(...[...v3, 1]));
  geom.vertices.push(new THREE.Vector3(...[...v1, 1]));
  
 

  var line = new THREE.Line(geom, mat);
  scene.add(line)
}

var defLevel = 8;

function serpinskiTriangle(v1, v2, v3, level = defLevel) {
 
  function getMidPoints(v1, v2, v3) {
    var mid = (v1, v2) => [(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2];
    return [mid(v1, v2), mid(v2, v3), mid(v3, v1)];
  }

  if (!level) {
    return;
  }

  var midpoints = getMidPoints(v1, v2, v3);

  createTriangle(...midpoints, { level });

  setTimeout(() => {
    serpinskiTriangle(v1, midpoints[0], midpoints[2], level - 1);
    serpinskiTriangle(midpoints[0], v2, midpoints[1], level - 1);
    serpinskiTriangle(midpoints[2], midpoints[1], v3, level - 1);
  });
}

var initialPoints = [[-100, -100], [0, 100], [100, -100]];
serpinskiTriangle(...initialPoints);



const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 300);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const controls = new THREE.OrbitControls(camera);

renderer.render(scene, camera);
controls.update();

function render() {
  controls.update();
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}