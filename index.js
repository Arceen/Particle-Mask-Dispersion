const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')

const settings = {
  dimensions: [1080, 1080]
}

const sketch = () =>{

  return ({context, width, height})=>{
      context.fillStyle="white";
      context.fillRect(0, 0, width, height);
  }
}
canvasSketch(sketch, settings)