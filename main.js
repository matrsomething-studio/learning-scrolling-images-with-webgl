import './style.css'

import * as THREE from 'three';

let speed = 0;
let position = 0;
let block = document.getElementById('block');

window.addEventListener('wheel', (e) => {
  speed += e.deltaY * 0.0003;
});

function animate() {
  position += speed;
  speed *= 0.8; // Create inertia 
  block.style.transform = `translate(0, ${position*100}px)`;
  window.requestAnimationFrame(animate);
}

animate();