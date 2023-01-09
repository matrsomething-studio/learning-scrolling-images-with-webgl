// Module(s)
import { gsap, Quad } from 'gsap';
import ThreeJSSketch from './ThreeJSSketch';

// Class - ScrollingImages
export default class ScrollingImages {
    constructor(options) {
        // Props
        this.options = options;
        this.sketch = new ThreeJSSketch({ dom: document.querySelector(this.options.sceneContainer) });
        this.elems = [...document.querySelectorAll(this.options.imageEls)];
        this.objs = Array(5).fill({ dist: 0 });
        this.speed = 0;
        this.position = 0;
        this.rounded = 0;
        this.diff = 0;
        this.scale = 0;

        // Methods
        this.bindEvents();
        this.animate();
    }

    animate() {
        this.position += this.speed;
        this.speed *= 0.8;

        // Create a state
        this.objs.forEach((o, i) => {
            o.dist = Math.min(Math.abs(this.position - i), 1);
            o.dist = 1 - o.dist ** 2;
            
            this.elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`;
            this.scale = 1 + 0.24 * o.dist;

            this.sketch.meshes[i].position.y = (i * 1.2) - (this.position * 1.2);
            this.sketch.meshes[i].scale.set(this.scale, this.scale, this.scale);
            this.sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist;
        });

        // Generate stick on scroll
        this.rounded = Math.round(this.position);
        this.diff = this.rounded - this.position;
        this.position += Math.sign(this.diff) * Math.pow(Math.abs(this.diff), 0.7) * 0.035;

        // Update
        this.sketch.animate();
    }

    setSpeed(value) {
        this.speed += value;
    }

    bindEvents() {
        const nav = document.querySelector(this.options.navEl);
        const tl2 = gsap.timeline();

        nav.addEventListener('mouseover', e => {
            this.sketch.tl.play();
        
        });
        
        nav.addEventListener('mouseout', e => {
            this.sketch.tl.reverse();
        });

        nav.addEventListener('click', e => {
            if (e.target.dataset.nav) {
                this.position = 0;
                tl2.to(this.sketch.meshGroup.position, {duration: .33,  y: (-e.target.dataset.nav * 1.2), ease: Quad.easeOut });
            } 
        });
    }

    resize() {
        this.sketch.handleResize();
    }
};