import './style.css'

import * as THREE from 'three';

let speed = 0;
let position = 0;
let block = document.getElementById('block');
window.addEventListener('wheel', (e) => {
  speed += e.deltaY * 0.02;
});

function animate() {
  console.log(position);
  block.style.transform = `translateY(${position}px)`;
  position += speed;
  speed *= 0.8;
  window.requestAnimationFrame(animate);
}

animate();