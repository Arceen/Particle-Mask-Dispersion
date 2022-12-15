const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [2084, 2084],
  animate: true,
};
let elCanvas;
const cursor = { x: 10000, y: 10000 };
const particles = [];
const particleCount = 2;
const sketch = ({ context, width, height, canvas }) => {
  elCanvas = canvas;
  elCanvas.addEventListener('mousedown', onMouseDown);
  for (let i = 0; i < particleCount; i++) {
    particles.push(
      new Particle({
        x: random.range(0, width),
        y: random.range(0, height),
        // x: height * 0.5,
        // y: height * 0.5,
        radius: random.range(10, 20),
      })
    );
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    });
  };
};

class Particle {
  constructor({ x, y, radius = 10 }) {
    this.x = x;
    this.y = y;

    this.ax = 0;
    this.ay = 0;

    this.vx = 0;
    this.vy = 0;

    this.ix = x;
    this.iy = y;

    this.radius = radius;
    this.minDist = 100;
    this.pushFactor = 0.02;
    this.pullFactor = 0.004;
    this.dampingFactor = 0.95;
  }
  update() {
    let dx, dy, dd, distanceDelta;

    dx = this.ix - this.x;
    dy = this.iy - this.y;
    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx - dy * dy);
    distanceDelta = this.minDist - dd;
    if (dd < this.minDist) {
      this.ax = (dx / dd) * distanceDelta * this.pushFactor;
      this.ay = (dy / dd) * distanceDelta * this.pushFactor;
    }

    this.ax += 0.001;
    this.vx += this.ax;
    this.vy += this.ay;
    this.vx *= this.dampingFactor;
    this.vy *= this.dampingFactor;
    this.x += this.vx;
    this.y += this.vy;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'white';

    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    // context.stroke();
    context.fill();
    context.restore();
  }
}

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  onMouseMove(e);
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
  cursor.x = x;
  cursor.y = y;
};
const onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  cursor.x = 10000;
  cursor.y = 10000;
};

canvasSketch(sketch, settings);
