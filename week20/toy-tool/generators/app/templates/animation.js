export class Timeline {
  constructor() {
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.state = 'inited';
    this.tick = () => {
      let t = Date.now() - this.startTime;
      for (let animation of this.animations) {
        let { object, porperty, start, end, template, delay, duration, timingFunction } = animation;
        let addTime = this.addTimes.get(animation);
        let progression = timingFunction((t - delay - addTime) / duration);
        if (t < delay + addTime) {
          continue
        }
        if (t > duration + delay + addTime) {
          progression = 1;
          this.animations.delete(animation);
          this.finishedAnimations.add(animation);
        }
        let value = animation.valueFromProgression(start, end, progression);
        object[porperty] = template(value);
      }
      if (this.animations.size)
        this.requestID = requestAnimationFrame(this.tick)
      else
        this.requestID = null
    }
  }

  pause() {
    if (this.state !== 'playing') return;
    this.pauseTime = Date.now();
    if (this.requestID) {
      cancelAnimationFrame(this.requestID)
      this.requestID = null
      this.state = 'pause';
    }
  }

  resume() {
    if (this.state !== 'pause') return;
    this.startTime += Date.now() - this.pauseTime;
    this.state = 'playing'
    this.requestID = requestAnimationFrame(this.tick);
  }

  start() {
    if (this.state !== 'inited') return;
    this.startTime = Date.now();
    this.state = 'playing';
    this.requestID = requestAnimationFrame(this.tick);
  }

  reset() {
    if (this.state === 'playing') 
      this.pause();
    this.startTime = Date.now();
    this.pauseTime = null;
    this.state = 'playing';
    this.requestID = null;
    this.animations = new Set();
    this.addTimes = new Map();
    this.tick();
  }

  restart() {
    if (this.state === 'playing') 
      this.pause();
    this.startTime = Date.now();
    this.pauseTime = null;
    this.state = 'playing';
    this.requestID = null;
    for (let animation of this.finishedAnimations) {
      this.animations.add(animation)
    }
    this.finishedAnimations = new Set();
    this.tick();
  }

  add(animation, addTime) {
    this.animations.add(animation);
    if (this.state === 'playing' && this.requestID === null) {
      this.requestID = requestAnimationFrame(this.tick)
    }
    if (this.state === 'playing') {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime);
    } else {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : 0);
    }
  }
}

export class Animation {
  constructor({
    object, porperty, template, start, end, duration, delay, timingFunction, valueFromProgression, after
  }) {
    this.object = object;
    this.porperty = porperty;
    this.template = template;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.after = after;
    this.delay = delay || 0;
    this.timingFunction = timingFunction || ((t) => t);
    this.valueFromProgression = valueFromProgression || ((start, end, progression) => {
      return start + progression * (end - start);
    });
  }

  // valueFromProgression(progression) {
  //   return this.start + progression * (this.end - this.start);
  // }
}

export class ColorAnimation {
  constructor({
    object, porperty, template, start, end, duration, delay, timingFunction, valueFromProgression
  }) {
    this.object = object;
    this.porperty = porperty;
    this.template = template;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFunction = timingFunction || ((t) => t);
    this.valueFromProgression = valueFromProgression || ((start, end, progression) => {
      return start + progression * (end - start);
    });
  }

  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    }
  }
}