let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {

    let nbrRings = 15;
    let object = createRings(nbrRings);
    let mainLoop = () => {
        requestAnimationFrame(mainLoop)
        updater(object, nbrRings);
    }

    let light = new THREE.PointLight(0xffffff, 1.0, 1000);
    light.position.set(0, 20, 20);
    let light2 = new THREE.PointLight(0xffffff, 1.0, 1000);
    light2.position.set(0, -20, -20);   
    let ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(object);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
    mainLoop();
    
}


function createRings(nbrRings) {
    let rings = new THREE.Object3D();
    let sphereGeom = new THREE.SphereGeometry();
    let sphereArgs = { transparent: false, color: getRandomColor(0.5, 0.5, 0.5) };
    let sphereMat = new THREE.MeshLambertMaterial(sphereArgs);
    let sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    rings.add(sphereMesh);

    for (let i = 0; i < nbrRings; ++i) {
        let ringsGeom = new THREE.TorusGeometry(2 + i * 2, 1, 20, 100);
        let ringsArgs = { transparent: false, color: getRandomColor(0.5, 0.5, 0.5) };
        let ringsMat = new THREE.MeshLambertMaterial(ringsArgs);
        let ringsMesh = new THREE.Mesh(ringsGeom, ringsMat);
        rings.add(ringsMesh);
    }

    return rings;
}



function updater(object, nbrRings) {
    let delta = clock.getDelta();
    let deltaRevRadians = rpsToRadians(0.1, delta);
    for (i = 0; i <= nbrRings; ++i) {
        let ring = object.children[i];
        if (i % 3 == 0)
            ring.rotation.y += deltaRevRadians;
        else
            ring.rotation.x += deltaRevRadians;
    }
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
    camera.position.set(0, 0, 80); 
    camera.lookAt(new THREE.Vector3(0, 0, 0));

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