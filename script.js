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
  constructor(x, y, radius, color, isRedLight) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    this.color = color;
    this.nativeColor = color;
    
    this.initialized = false;
    
    this.createLight();
    this.initialize();
    
    this.isRedLight = isRedLight;
  }
  
  static backGroundColor = "white";
  static allLights = [];
  
  static initialDel = 2000;
  static durationVal = 5000;
  static finalDel = 3000;
  
  static MIN = 100;
  static MAX = 50000;
  static DEFAULT = 2000;
  
  static validValueTime(val) {
    if (val > this.MIN && val < this.MAX) {
      return val;
    } else {
      if (Number.isFinite(val)) {
        if (val > this.MAX) {
          return this.MAX;
        } else {
          return this.MIN;
        }
      } else {
        return this.DEFAULT
      }
      
      return this.DEFAULT;
    }
  }
  
  static initButtons() {
    const optionsDiv = document.querySelector("[lightOptions]")
    const inputVals = optionsDiv.children;
    const enterButton = optionsDiv.querySelector("button");

    enterButton.addEventListener("click", () => {
      this.initialDel = LIGHT.validValueTime(+inputVals[0].value);
      inputVals[0].value = this.initialDel;
      this.durationVal = LIGHT.validValueTime(+inputVals[1].value);
      inputVals[1].value = this.durationVal;
      this.finalDel = LIGHT.validValueTime(+inputVals[2].value)
      inputVals[2].value = this.finalDel;
   
    })
  }
  
  
  
  static running = false;
  
  static initializeSystemToStreetLightColors() {
    this.allLights.forEach(light => {
      if (light.isRedLight) {
        light.setColor("black")
      }
    })
  }
  

  createLight(colorVal = this.color, padding = 0) {
    circle(this.x ?? 0, this.y ?? 0, this.radius + padding ?? 20, colorVal ?? "yellow");
  }
  
  initialize() {
    if (!this.initialized) {
      LIGHT.allLights.push(this);
      this.initialized = true;
    }
    
    return this;
  }
  
  static allLightsOut() {
    this.allLights.forEach(light => {
      light.setColor("black")
    })
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
    this.color = colorVal;
    this.createLight();
  }
  
  setColor(colorVal) {
    if (typeof colorVal != "string") return;
    this.color = colorVal;
    this.replaceLightWithColor(colorVal);
  }
  
  async transitionYellowToRed(duration = LIGHT.durationVal) {
    
    if (!Number.isFinite(duration) || duration < LIGHT.MIN || duration > LIGHT.MAX) return;
    
    let interpolation = 0;
    
    return new Promise((resolve) => {

      const start = performance.now();
      let elapsed;
      
      const tick = (now) => {
        elapsed = now - start;
        interpolation = Math.min(elapsed / duration, 1);
        
        const green = Math.floor(255 * (1 - interpolation));
        const currentColor = `rgb(255, ${green}, 0)`;

        if (this.isRedLight) {
          this.setColor(currentColor);
        }
        
        if (elapsed < duration) {
          requestAnimationFrame(tick);
        } else {
          resolve("Success");
        }
      }
      requestAnimationFrame(tick);
    })
  }
  
  static get systemReadyForStart() {
    return (!this.running);
  }
  
  static resetSystem() {
    this.allLights.forEach(light => {
      light.setColor(light.isRedLight ? "black" : light.nativeColor);
    })
    // this.turnOffRedLights();
    // this.redifyNonRedLights();
  }
  
  static turnOffNonReds() {
    this.allLights.forEach(light => {
      if (!light.isRedLight) {
        light.setColor("black");
      }
    })
  }
  
  static async systemStart() {
    if (!this.systemReadyForStart) return;
    
    const {promise, resolve} = Promise.withResolvers();
    
    window.setTimeout(() => {
      resolve();
    }, this.initialDel)
    
    await promise;
    
    this.running = true;
    
    this.resetSystem();
    this.turnOffNonReds();
  
    for (let i = 0; i < this.allLights.length; i++) {
        
      const light = this.allLights[i].initialize();

      if (light.isRedLight) {
        await light.transitionYellowToRed(this.durationVal);
      }
    }
    
    window.setTimeout(() => {
      this.resetSystem();
      this.running = false;
    }, this.finalDel)
  }
}

LIGHT.setBackGroundColor("blue");
rectangle(130, 120, 51, 90, "black");
const myLight = new LIGHT(155, 100, 15, "green", false);
const myLight2 = new LIGHT(155, 60, 15, "yellow", true);

LIGHT.initializeSystemToStreetLightColors();
LIGHT.initButtons();

document.querySelector("canvas").addEventListener("click", function() {
  LIGHT.systemStart();
})
