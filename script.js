const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext('2d');



function initializeCanvas(createBorder = true, color = "red") {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  
  if (createBorder) {
    canvas.style.border = `2px solid ${color}`;
  }
}

function rectangle(x, y, elWidth, elHeight, color = "black", full = false) {
  
  if (typeof color != "string") return;
  
  const canvas = document.querySelector("canvas");
  const canvasCtx = canvas.getContext('2d');
  
  if (full) {
    canvasCtx.fillStyle = color;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }
  
  canvasCtx.fillStyle = color;
  canvasCtx.fillRect(x, canvas.height - y, elWidth, elHeight);
}

function circle(x, y, radius, color = "black") {
  if (typeof color != "string") return;
  
  const canvas = document.querySelector("canvas");
  const canvasCtx = canvas.getContext('2d');
  
  canvasCtx.beginPath();
  canvasCtx.arc(x, canvas.height - y, radius, 0, Math.PI * 2);
  canvasCtx.fillStyle = color;
  canvasCtx.fill();
}

class LIGHT {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    this.color = color;
    this.createLight();
  }
  
  static backGroundColor = "white";
  

  createLight(colorVal = this.color, padding = 0) {
    circle(this.x ?? 0, this.y ?? 0, this.radius + padding ?? 20, colorVal ?? "yellow");
  }
  
  static setBackGroundColor(color = "white") {
    if (typeof color != "string") return;
    this.backGroundColor = color;
    rectangle(0, 0, 0, 0, color, true);
    
  }
  
  removeLight() {
    this.createLight(LIGHT.backGroundColor, 1);
  }
  
  replaceLightWithColor(colorVal = "red") {
    if (typeof colorVal != "string") return;
    this.removeLight();
    this.setColor(colorVal);
    this.createLight();
  }
  
  setColor(colorVal) {
    if (typeof colorVal != "string") return;
    this.color = colorVal;
    this.replaceLightWithColor(colorVal);
  }
  
  async transitionYellowToRed(duration = 1000) {
    
    if (Number.isFinite(duration) || duration < 0 || duration > 100000) return;
    
    let interpolation = 0;
    
    return new Promise((resolve), function() {

      const start = performance.now();
      let elapsed;
      
      const tick = (now) => {
        elapsed = now - start;
        interpolation = Math.min(elapsed / duration, 1);
        
        const green = Math.floor(255 * (1 - interpolation));
        const currentColor = `rgb(255, ${green}, 0)`;

        this.setColor(currentColor);
        
        
        
        if (interpolation < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve("Success");
        }
      }
      requestAnimationFrame(tick);
    })
  }
  
  
}

LIGHT.setBackGroundColor("blue");
rectangle(130, 120, 51, 90, "black");
const myLight = new LIGHT(155, 100, 15, "red");
const myLight2 = new LIGHT(155, 60, 15, "yellow");

myLight2.transitionYellowToRed();



// circle(155, 80, 15, "green");
// circle(155, 40, 15, "red");
