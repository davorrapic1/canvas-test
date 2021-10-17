let canvas;
let ctx;
let flowEffect;
let flowEffectAnimation;
window.onload = function () {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  flowEffect = new FlowEffect(ctx, canvas.width, canvas.height);
  flowEffect.animate(0);
};

window.addEventListener("resize", () => {
  cancelAnimationFrame(flowEffectAnimation);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowEffect = new FlowEffect(ctx, canvas.width, canvas.height);
  flowEffect.animate(0);
});

const mouse = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

class FlowEffect {
  #ctx;
  #width;
  #height;

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#ctx.lineWidth = 1.3;
    this.#width = width;
    this.#height = height;
    this.lastTime = 0;
    this.interval = 1000 / 60;
    this.timer = 0;
    this.cellSize = 15;
    this.gradient;
    this.#crateGradient();
    this.#ctx.strokeStyle = this.gradient;
    this.radious = 0;
    this.vr = 0.03;
  }

  #crateGradient() {
    this.gradient = this.#ctx.createLinearGradient(
      0,
      0,
      this.#width,
      this.#height
    );
    this.gradient.addColorStop("0.1", "#ff5c33");
    this.gradient.addColorStop("0.3", "#03fc3d");
    this.gradient.addColorStop("0.6", "#55fa5d");
    this.gradient.addColorStop("0.8", "#ff5eb4");
    this.gradient.addColorStop("0.9", "#ffff33");
  }

  #drawLine(angle, x, y) {
    let positionX = x;
    let positionY = y;
    let dx = mouse.x - positionX;
    let dy = mouse.y - positionY;

    let distance = dx * dx + dy * dy;
    if (distance > 250000) distance = 250000;
    else if (distance < 10000) distance = 10000;
    const length = distance / 10000;
    this.#ctx.beginPath();
    this.#ctx.moveTo(
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length
    );

    //this.#ctx.moveTo(mouse.x, mouse.y)
    this.#ctx.lineTo(x + 9, y + 9);
    this.#ctx.stroke();
  }

  animate(timeStamp) {
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    //
    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      this.radious += this.vr;
      if (this.radious > 5 || this.radious < -5) this.vr *= -1;
      for (let y = 0; y < this.#height; y += this.cellSize) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          const angle =
            (Math.cos(mouse.x * x * 0.00001) + Math.sin(mouse.y * y * 0.00001)) * this.radious;
          this.#drawLine(angle, x, y);
        }
      }

      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }
    flowEffectAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}
