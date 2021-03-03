let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();



var controls = {nbrBursts: 150, breadth: 14, width: 9, height: 9};

var gui = new dat.GUI();
gui.add(controls, 'nbrBursts', 50, 500).listen().onChange(function (value) { createScene(); });
gui.add(controls, 'breadth', 6, 100).listen().onChange(function (value) { createScene(); });
gui.add(controls, 'width', 6, 100).listen().onChange(function (value) { createScene(); });
gui.add(controls, 'height', 6, 100).listen().onChange(function (value) { createScene(); });


function createScene() {

    
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    
    let root = starburstsCuboid(starburstFnc, controls.nbrBursts, controls.breadth, controls.width, controls.height);
    scene.add(root);
}


function starburstsCuboid(fnc, nbrBursts, breadth, width, height) {
    let root = new THREE.Object3D();
    for (let i = 0; i < nbrBursts; i++) {
        let mesh = starburst(10, 1.5);
        let m = getRandomPointCuboid(breadth, width, height);
        mesh.position.set(m.x, m.y, m.z);
        root.add(mesh);
    }
    return root;
}



function createStarburstFnc(maxRays, maxRad) {
    function fnc() {
        return starburst(maxRays, maxRad);
    }
    return fnc;
}

let starburstFnc = createStarburstFnc();


function getRandomPointCuboid(breadth, width, height) {
    let r = Math.random() * 6; 
    if (r < 1) { 
        let z = breadth / 2;
        let x = (Math.random() * width) - (width / 2);
        let y = (Math.random() * height) - (height / 2);
        return new THREE.Vector3(x, y, z);
    }
    else if (r < 2) { 
        let z = -breadth / 2;
        let x = (Math.random() * width) - (width / 2);
        let y = (Math.random() * height) - (height / 2);
        return new THREE.Vector3(x, y, z);
    }
    else if (r < 3) { 
        let z = (Math.random() * breadth) - (breadth / 2);
        let x = (Math.random() * width) - (width / 2);
        let y = height / 2;
        return new THREE.Vector3(x, y, z);
    }
    else if (r < 4) { 
        let z = (Math.random() * breadth) - (breadth / 2);
        let x = (Math.random() * width) - (width / 2);
        let y = -height / 2;
        return new THREE.Vector3(x, y, z);
    }
    else if (r < 5) { 
        let z = (Math.random() * breadth) - (breadth / 2);
        let x = width / 2;
        let y = (Math.random() * height) - (height / 2);
        return new THREE.Vector3(x, y, z);
    }
    else { 
        let z = (Math.random() * breadth) - (breadth / 2);
        let x = -width / 2;
        let y = (Math.random() * height) - (height / 2);
        return new THREE.Vector3(x, y, z);
    }
}



function starburst(maxRays, maxRad) {
    let rad = 1;
    let origin = new THREE.Vector3(0, 0, 0);
    let innerColor = getRandomColor(0.8, 0.1, 0.8);
    let black = new THREE.Color(0x000000);
    let geom = new THREE.Geometry();
    let nbrRays = getRandomInt(1, maxRays);
    if (Math.random() < 0.5) {
        nbrRays = getRandomInt(4, 25);
    }
    for (let i = 0; i < nbrRays; i++) {
       
        let r = rad * getRandomFloat(0.1, maxRad);
        let dest = getRandomPointOnSphere(r);
        geom.vertices.push(origin, dest);
        geom.colors.push(innerColor, black);
    }
    let args = { vertexColors: true, linewidth: 2 };
    let mat = new THREE.LineBasicMaterial(args);
    return new THREE.Line(geom, mat, THREE.LineSegments);
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

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);

    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(0, 0, 50);
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