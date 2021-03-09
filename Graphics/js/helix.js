let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();



var controls = {nbrSolids: 29, angle: Math.PI / 4, distance: 0.5, radius: 2, color: "Yellow", type: "Icosahedron"};

var gui = new dat.GUI();
gui.add(controls, 'nbrSolids', 5, 200).listen().onChange(function (value) { 
createScene(); });
gui.add(controls, 'angle', Math.PI / 8, Math.PI).listen().onChange(function (value){ 
createScene(); });
gui.add(controls, 'distance', 0.2, 5).listen().onChange(function (value) { 
createScene(); });
gui.add(controls, 'radius', 1, 10).listen().onChange(function (value) { 
createScene(); });
gui.add(controls, 'color', ['Yellow', 'Sky Blue']).onChange(function (value) { 
createScene(); });
gui.add(controls, 'type', ['Icosahedron', 'Sphere']).onChange(function (value) { 
createScene(); });


    function createScene() {

    let nbrSolids = 29;
    let angle = Math.PI / 4;
    let distance = 0.5;
    let radius = 2;
    let type = "Icosahedron";
    
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

     let color = new THREE.Color();
     if (controls.color == "Yellow")
         color = new THREE.Color(1.3, 1.3, 0);
     else 
         color = new THREE.Color(0, 1.5, 1.5);
         


     let geom = new THREE.Geometry();
     if (controls.type == "Icosahedron")
        geom = new THREE.IcosahedronGeometry(1);
     else 
        geom = new THREE.SphereGeometry(1);

     let mat = new THREE.MeshLambertMaterial({ color: color });
     let object = new THREE.Mesh(geom, mat);
 


    let helix = createHelix(object, controls.nbrSolids, controls.radius, controls.angle, controls.distance);
    let light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 20, 20);
    let light2 = new THREE.PointLight(0xffffff, 1.0, 100);
    light2.position.set(0, -20, -20);
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(helix);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight)

}


 function createHelix(object, n, radius, angle, dist) {
    let root = new THREE.Object3D();
    for (let i = 0, a = 0, height = 0; i < n; i++, a += angle, height += dist) {
        let s = new THREE.Object3D();
        s.rotation.y = a;
        let m = object.clone();
        m.position.x = radius;
        m.position.y = height;
        s.add(m);
        root.add(s);
    }
    return root;
}




function animate() {
    window.requestAnimationFrame(animate);
    render();
}


function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);
    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(0, 30, 0);
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