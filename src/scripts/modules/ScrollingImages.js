// Utilities


// Component(s)


// Module(s)
import { gsap, Quad } from 'gsap';
import ThreeJSSketch from './ThreeJSSketch';


// Props
const sketch = new ThreeJSSketch({ dom: document.querySelector("#scene") });
const elems = [...document.querySelectorAll('.n')];
const objs = Array(5).fill({ dist: 0 });

let speed = 0;
let position = 0;
let rounded = 0;
let diff = 0;
let scale = 0;


// Method(s)
const animate = () => {
    position += speed;
    speed *= 0.8;

    // Create a state
    objs.forEach((o, i) => {
        o.dist = Math.min(Math.abs(position - i), 1);
        o.dist = 1 - o.dist ** 2;
        
        elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`;
        scale = 1 + 0.24 * o.dist;

        sketch.meshes[i].position.y = (i * 1.2) - (position * 1.2);
        sketch.meshes[i].scale.set(scale, scale, scale);
        sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist;
    });

    // Generate sticky scroll
    rounded = Math.round(position);
    diff = rounded - position;
    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.035;

    // // Update DOM
    sketch.animate();
};

const setSpeed = (value) => {
    speed += value;
};

const bindEvents = () => {
    const nav = document.querySelector('.nav');
    const navs = [...nav.querySelectorAll('li')];
    const tl2 = gsap.timeline();

    // Nav
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
};

const resize = () => {
    sketch.handleResize();
};

const init = () => {
    bindEvents();
    animate();
};
    

// Export(s)
export {
	init,
    setSpeed,
    resize,
    animate
};
