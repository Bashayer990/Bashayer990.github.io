let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


var controls = {nbrSolids: 16, opacity: 0.8, scaleX: 1, scaleY: 1, scaleZ: 1, 
                 type: "All", rainbow: false, averageScale: function () {
        let a = (this.scaleX + this.scaleY + this.scaleZ) / 3;
        this.scaleX = a;
        this.scaleY = a;
        this.scaleZ = a;
        createScene();
    }
};


var gui = new dat.GUI();
gui.add(controls, 'nbrSolids', 2, 80).step(1).onChange(function (value) { createScene(); });
gui.add(controls, 'opacity', 0.0, 1.0).step(0.1).onChange(function (value) { createScene(); });
gui.add(controls, 'scaleX', 1, 10).onChange(function (value) { createScene(); });
gui.add(controls, 'scaleY', 1, 10).onChange(function (value) { createScene(); });
gui.add(controls, 'scaleZ', 1, 10).onChange(function (value) { createScene(); });
gui.add(controls, 'averageScale');
gui.add(controls, 'type', ['All', 'Tetrahedron', 'Icosahedron', 'Box']).onChange(function (value) { createScene(); });
gui.add(controls, 'rainbow').onChange(function (value) { createScene(); });


function makeSolidsFnc() {
    const solids = [
           new THREE.TetrahedronGeometry(1),
           new THREE.IcosahedronGeometry(1),
           new THREE.BoxGeometry(1, 1, 1)
    ];
    const nbrSolids = solids.length;
    function f(i, n, opacity, type, rainbow) {
        let geom = new THREE.Geometry();
        if (type == "Tetrahedron")
            geom = solids[0];
        else if (type == "Icosahedron")
            geom = solids[1];
        else if (type == "Box")
            geom = solids[2];
        else
            geom = solids[i % nbrSolids];

        let color = new THREE.Color(0.10, 0.1, 0.8);
        if (rainbow)
            color = new THREE.Color().setHSL(i / n, 1.0, 0.5);
        let args = { color: color , opacity: 0.8, transparent: true };
        let mat = new THREE.MeshLambertMaterial(args);
        return new THREE.Mesh(geom, mat);
    }
    return f;
}

let solidsFnc = makeSolidsFnc();

function createRing(fnc, n, t, opacity, scaleX, scaleY, scaleZ, type, rainbow) {
    let root = new THREE.Object3D();
    let angleStep = 2 * Math.PI / n;
    for (let i = 0, a = 0; i < n; i++, a += angleStep) {
        let s = new THREE.Object3D();
        s.rotation.y = a;
        let m = fnc(i, n, opacity, type, rainbow);
        m.position.x = t;
        m.scale.set(scaleX, scaleY, scaleZ);
        s.add(m);
        root.add(s);
    }
    return root;
}

function createScene() {
    
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
   
    let root = createRing(solidsFnc, controls.nbrSolids, 16, controls.opacity, controls.scaleX, controls.scaleY, controls.scaleZ, controls.type, controls.rainbow);
    let light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 10, 10);
    let light2 = new THREE.PointLight(0xffffff, 1.0, 1000);
    light2.position.set(10, -10, -10);
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(root);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
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
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);
    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(0, 40, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
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
