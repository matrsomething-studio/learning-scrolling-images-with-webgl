// https://threejs.org/
import * as THREE from 'three';

// https://threejs.org/docs/#examples/en/loaders/GLTFLoader
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// Shaders
import fragment from '../shaders/distort/fragment.glsl';
import vertex from '../shaders/distort/vertex.glsl';

// DAT GUI - https://github.com/dataarts/dat.gui
import * as dat from 'dat.gui';

// GSAP - https://greensock.com/docs/v3/GSAP/Timeline
import { gsap, Quad } from 'gsap';

// Controls -  https://threejs.org/docs/?q=OrbitControls#examples/en/controls/OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Class - ThreeJSSketch
export default class ThreeJSSketch {
    constructor(options) {
        // Props
        this.options = options;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.time = 0;
        this.speed = 0;
        this.meshGroup = new THREE.Group();
        this.meshes = [];
        this.materials = [];
        this.tl = gsap.timeline();

        // Methods
        this.setScene();
        this.setRenderer();
        this.setCamera();
        this.setControls();
        this.createMaterial();
        this.createObjects();
        this.createGUI();
        this.handleResize();
    }

    createGUI() {
        // DAT GUI - https://github.com/dataarts/dat.gui
        this.GUI = new dat.GUI();
        this.meshes.forEach((mesh, indx) => {
            let folder = this.GUI.addFolder(`Card 00${indx}`);
            let rotationMax = Math.PI * 2;
            folder.add(mesh.rotation, "x", 0, rotationMax, 0.01); 
            folder.add(mesh.rotation, "y", 0, rotationMax, 0.01); 
            folder.add(mesh.rotation, "z", 0, rotationMax, 0.01); 
            folder.add(mesh, "visible", 0, 1, 0.01); 
        });

        this.GUI.close();
    }

    setScene() {
        // Scene - https://threejs.org/docs/?q=Scene#api/en/scenes/Scene
        this.scene = new THREE.Scene();
    }

    setRenderer() {
        // Renderer - https://threejs.org/docs/#api/en/renderers/WebGLRenderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.sortObjects = false;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container = this.options.dom;
        this.container.appendChild(this.renderer.domElement);
    }

    setCamera() {
        // Camera - https://threejs.org/docs/?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera
        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.width,
            0.001,
            1000
        );
        this.camera.position.set(0, 0, 2);
        this.camera.lookAt(0, 0, 0);
    }

    setControls() {
        // Controls -  https://threejs.org/docs/?q=OrbitControls#examples/en/controls/OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    createObjects() {
        this.images = [...document.querySelectorAll('.n img')];
        this.images.forEach((img, index) => {
            let mat = this.material.clone();
            this.materials.push(mat);

            mat.uniforms.texture1.value = new THREE.TextureLoader().load(img.attributes[0].value);
            mat.uniforms.texture1.value.needsUpdate = true;

            // 1.5 aspect ratio of image
            let geo = new THREE.PlaneGeometry(1.5, 1, 20, 20);
            let mesh = new THREE.Mesh(geo, mat);
            
            this.meshGroup.add(mesh);
            this.meshes.push(mesh);    
        });

        this.scene.add(this.meshGroup);  
        this.meshGroup.rotation.x = -.3;
        this.meshGroup.rotation.y = -.3;
        this.meshGroup.rotation.z = -.1;

        this.tl.to(this.meshGroup.rotation, {duration: .5, x: 0, y: 0, z: 0, ease: Quad.easeInOut });
        this.tl.pause();
    }

    createMaterial() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: {
                    type: "f",
                    value: 0
                },
                distanceFromCenter: {
                    type: "f",
                    value: 0
                },
                texture1: {
                    type: "t",
                    value: null
                },
                resolution: {
                    type: "v4",
                    value: new THREE.Vector4()
                },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                }
            },
            // wireframe: true,
            transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment
        });
    }

    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        let a1, a2;
        this.imageAspect = 1080 / 1920;

        if (this.camera.aspect > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = (this.height / this.width) / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    animate() {
        this.time += 0.05;

        if (this.materials) {
            this.materials.forEach(m => {
                m.uniforms.time.value = this.time;
            });
        } else {
            this.material.uniforms.time.value = this.time;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
};