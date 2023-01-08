// Imports
import '../styles/main.scss';
import { gsap, Quad } from 'gsap';
import Sketch from './modules/sketch';

// Main
const App = (() => {
    // Props
    let objs = Array(5).fill({
        dist: 0
    });

    const sketch = new Sketch({
        dom: document.querySelector("#scene")
    });

    let tl2 = gsap.timeline();
    let speed = 0;
    let position = 0;
    let rounded = 0;
    let diff = 0;
    let elems = [...document.querySelectorAll('.n')];
    let nav = document.querySelector('.nav');
    let navs = [...nav.querySelectorAll('li')];

    // Methods
    function clamp (num, min, max) {
        Math.min(Math.max(num, min), max);
    } 
    
    function animate() {
        position += speed;
        speed *= 0.8;
    
        // Create a state
        objs.forEach((o, i) => {
            o.dist = Math.min(Math.abs(position - i), 1);
            o.dist = 1 - o.dist ** 2;
            
            elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`;
            let scale = 1 + 0.24 * o.dist;
            
            sketch.meshes[i].position.y = (i * 1.2) - (position * 1.2);
            sketch.meshes[i].scale.set(scale, scale, scale);
            sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist;
        });
    
        // Generate sticky scroll
        rounded = Math.round(position);
        diff = rounded - position;
        position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.035;
    
        // Update DOM
        requestAnimationFrame(animate);
    }
    
    function bindEvents() {
        window.addEventListener('wheel', (e) => {
            speed += e.deltaY * 0.0003;
        });
        
        nav.addEventListener('mouseover', e => {
            sketch.tl.play();
        });
        
        nav.addEventListener('mouseout', e => {
            sketch.tl.reverse();
        });

        nav.addEventListener('click', e => {
            if (e.target.dataset.nav) {
                position = 0;
                tl2.to(sketch.meshGroup.position, {duration: .33,  y: (-e.target.dataset.nav * 1.2), ease: Quad.easeOut });
            } 
        });
    }

    function init() {
        bindEvents();
        animate();
    }

    return {
        init: init
    };
})();


App.init();