import '../styles/main.scss';
import Sketch from './module';


const sketch = new Sketch({
    dom: document.querySelector("#scene")
});

let speed = 0;
let position = 0;
let rounded = 0;
let diff = 0;
let wrap = document.getElementById('wrap');
let elems = [...document.querySelectorAll('.n')];
let objs = Array(5).fill({
    dist: 0
});

window.addEventListener('wheel', (e) => {
    speed += e.deltaY * 0.0003;
});

function animate() {
    position += speed;

    // Create inertia 
    speed *= 0.8;

    // Create a state
    objs.forEach((o, i) => {
        o.dist = Math.min(Math.abs(position - i), 1);
        o.dist = 1 - o.dist ** 2;
        elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`;
        let scale = 1 + 0.24 * o.dist;
        sketch.meshes[i].position.y = (i * 1.2) - (position * 1.2);
        // sketch.meshes[i].position.x = (i * 1.75) - (position * 1.75);
        sketch.meshes[i].scale.set(scale, scale, scale);
        sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist;
    });

    // Generate sticky scroll
    rounded = Math.round(position);
    diff = rounded - position;
    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.035;

    // Update DOM
    // wrap.style.transform = `translate(0, ${-position * 100 + 50}px)`;
    window.requestAnimationFrame(animate);
}

animate();

let nav = document.querySelector('.nav');
let navs = [...nav.querySelectorAll('li')];


nav.addEventListener('mouseover', e => {
    sketch.tl.play();
});

nav.addEventListener('mouseout', e => {
    sketch.tl.reverse();
});