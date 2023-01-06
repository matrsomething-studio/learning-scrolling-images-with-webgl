import * as THREE from "three";
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"

import fragment from "./shader/fragment.glsl"
import vertex from "./shader/vertex.glsl"
import * as dat from "dat.gui"

// import { TimelineMax } from "gsap";
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

export default class Sketch {
    constructor(options) {
        // Props
        this.options = options;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.paused = false;
        this.requestID = null;
        this.time = 0;
        this.speed = 0;
        this.materials = [];
        this.meshes = [];
        this.groups = [];

        // Init
        this.settings();
        this.setScene();
        this.setRenderer();
        this.setCamera();
        this.setControls();
        this.createObjects();
        this.setImages();
        this.handleResize();
        this.resize();
        this.animate();
    }

    settings() {
        let that = this;
        this.settings = {
            progress: 0
        };
        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0, 1, 0.01);
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

    setImages() {
        this.images = [...document.querySelectorAll('img')];
        this.images.forEach((img, index) => {
            let mat = this.material.clone();
            this.materials.push(mat);
            let group = new THREE.Group();
            mat.uniforms.texture1.value = new THREE.TextureLoader().load(img.attributes[0].value);
            mat.uniforms.texture1.value.needsUpdate = true;

            // 1.5 aspect ratio of image
            let geo = new THREE.PlaneGeometry(1.5, 1, 20, 20);
            let mesh = new THREE.Mesh(geo, mat);
            group.add(mesh);
            this.groups.push(group);
            this.scene.add(group);
            this.meshes.push(mesh);
            mesh.position.y = index * 1.2;

            group.rotation.x = -.3;
            group.rotation.y = -.3;
            group.rotation.z = -.1;
        });
    }

    createObjects() {
        let that = this;
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
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        let a1, a2;
        this.imageAspect = 853 / 1280;

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

    stop() {
        this.paused = true;
        cancelAnimationFrame(this.requestID);
    }

    play() {
        this.paused = false;
        this.requestID = requestAnimationFrame(this.animate.bind(this));
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

        this.play();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
};