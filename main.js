import './style.css'

import * as THREE from 'three';

let speed = 0;
let position = 0;
let rounded = 0;
let diff = 0;
let block = document.getElementById('block');

window.addEventListener('wheel', (e) => {
  speed += e.deltaY * 0.0003;
});

function animate() {
  position += speed;
  speed *= 0.8; // Create inertia 
  rounded = Math.round(position);
  diff = rounded - position; // Generate sticky scroll
  position += diff * 0.025;
  block.style.transform = `translate(0, ${position*100}px)`;
  window.requestAnimationFrame(animate);
}

animate();