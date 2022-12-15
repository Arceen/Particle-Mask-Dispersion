const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};
const particles = [];
const particleCount = 10;
const sketch = ({ context, width, height }) => {
  for (let i = 0; i < particleCount; i++) {
    particles.push(
      new Particle({
        x: random.range(0, width),
        y: random.range(0, height),
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
  }
  update() {
    this.ax += 0.001;
    this.vx += this.ax;
    this.vy += this.ay;
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

canvasSketch(sketch, settings);
