import * as THREE from "three";
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"

import fragment from "./shader/fragment.glsl"
import vertex from "./shader/vertex.glsl"
import * as dat from "dat.gui"

// import { TimelineMax } from "gsap";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Sketch {
    constructor(selector){
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.sortObjects = false;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        this.container = selector.dom;
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );

        this.camera.position.set(0, 0, 2);  
        this.camera.lookAt(0, 0, 0);
        this.time = 0;
        this.speed = 0;
        this.targetSpeed = 0;
        this.mouse = new THREE.Vector2();
        this.followMouse = new THREE.Vector2();
        this.prevMouse = new THREE.Vector2();
        
        this.paused = false;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.materials = [];
        this.meshes = [];
        this.groups = [];
        
        // this.settings();
        this.setupResize();
        this.mouseMove();

        this.addObjects();
        this.resize();
        this.render();
        this.handleImages();
    }

    handleImages() {
        this.images = [...document.querySelectorAll('img')];
        this.images.forEach((img, index) => {
            let mat = this.material.clone();
            this.materials.push(mat);
            let group = new THREE.Group();
            mat.uniforms.texture1.value = new THREE.TextureLoader().load(img.attributes[0].value);
            mat.uniforms.texture1.value.needsUpdate = true;

            console.log(mat.uniforms);

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

    mouseMove(){
        let that = this;
        this.container.addEventListener('mousemove', ( e ) => {
            // mousemove / touchmove
            this.mouse.x = ( e.clientX / window.innerWidth ) ;
            this.mouse.y = 1. - ( e.clientY / window.innerHeight );
        });
    }

    settings(){
        let that = this;
        this.settings = {
            progress: 0
        };
        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0, 1, 0.01);
    }

    setupResize(){
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.imageAspect = 853/1280;
        let a1, a2;
        if(this.camera.aspect > this.imageAspect) {
            a1 = (this.width/this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = (this.height/this.width) / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        this.camera.updateProjectionMatrix();
    }

    addObjects(){
        let that = this;
        // this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                distanceFromCenter: { type: "f", value: 0 },
                texture1: { type: "t", value: null },
                resolution: { type: "v4", value: new THREE.Vector4() },
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

    stop() {
        this.paused = true;
    }

    play() {
        this.paused = false;
        this.render();
    }

    render(){
        this.time += 0.05;
        
        if (this.materials) {
            this.materials.forEach(m => {
                m.uniforms.time.value = this.time;
            });
        }
        
        // this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
};