let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {

    let nbrBoxes = 100;
    let minSide = 5;
    let maxSide = 20;
    let minHeight = 5;
    let maxHeight = 60;

    let surface = createSurface();
    surface.position.set(0,-40, 0);
    scene.add(surface);

    let boxes = randomBoxes(nbrBoxes, minSide, maxSide, minHeight, maxHeight);
    let light = new THREE.PointLight(0xffffff, 1.0, 1000);
    light.position.set(0, 20, 20);
    let light2 = new THREE.PointLight(0xffffff, 1.0, 1000);
    light2.position.set(0, -20, -20);   
    let ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(boxes);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
}


function createSurface() {
    let geom = new THREE.BoxGeometry(200, .1, 200);
    let args = { transparent: false, color: new THREE.Color(0.10, 0.10, 0.10) };
    let mat = new THREE.MeshLambertMaterial(args);
    let surface = new THREE.Mesh(geom, mat);
    return surface;
}


function randomBoxes(nbrBoxes, minSide, maxSide, minHeight, maxHeight) {
    let boxes = new THREE.Object3D();
    for (let i = 0; i < nbrBoxes; ++i) {
        let scaleX = Math.random() * (maxSide - minSide) + minSide;
        let scaleY = Math.random() * (maxHeight - minHeight) + minHeight;
        let scaleZ = Math.random() * (maxSide - minSide) + minSide;
        let geom = new THREE.BoxGeometry(scaleX, scaleY, scaleZ);
        let args = { transparent: true, opacity: 0.8, color: getRandomColor(0.6, 0.1, 0.6) };
        let mat = new THREE.MeshLambertMaterial(args);
        let object = new THREE.Mesh(geom, mat);
        let x = Math.random() * (200 - scaleX) - (100 - scaleX / 2); 
        let z = Math.random() * (200 - scaleZ) - (100 - scaleZ / 2);
        let y = scaleY / 2 - 40;
        object.position.set(x, y, z);
        boxes.add(object);
    }
    return boxes;
}




function animate() {
    window.requestAnimationFrame(animate);
    render();
}


function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let canvasRatio = canvasWidth / canvasHeight;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);
    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(0, 30, 300);
    camera.lookAt(new THREE.Vector3(0, -40, 0)); 

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
    let container = document.getElementById('container');
    let canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}


init();
createScene();
addToDOM();
render();
animate();