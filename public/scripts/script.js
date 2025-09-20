document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.textContent = 'Sending...';

  const formData = Object.fromEntries(new FormData(e.target).entries());

  try {
    const res = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    status.textContent = data.message;
    e.target.reset();
  } catch (err) {
    status.textContent = "❌ Error sending message.";
  }
});
const canvas = document.getElementById('hero-bg');
const ctx = canvas.getContext('2d');

let particlesArray;
let width = canvas.width = window.innerWidth;
let height = canvas.height = document.querySelector('.hero').offsetHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = document.querySelector('.hero').offsetHeight;
  init();
});

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = `rgba(110, 231, 183, ${Math.random()})`; // accent color
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x > width) this.x = 0;
    if(this.x < 0) this.x = width;
    if(this.y > height) this.y = 0;
    if(this.y < 0) this.y = height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for(let i = 0; i < 80; i++) { // number of particles
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0,0,width,height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

init();
animate();
