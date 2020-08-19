import { enableGesture } from './gesture.js'

export function createElement(Cls, attributes, ...children) {
    let o;
    if (typeof Cls === "string") {
        o = new Wrapper(Cls)
    } else {
        o = new Cls();
    }
    
    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }

    let visit = (children) => {
        for (let child of children) {
            if (child instanceof Array) {
                visit(child);
                continue;
            }
            if (typeof child === "string") 
                child = new Text(child);
            o.appendChild(child);
        }
    }
    visit(children)
    return o
}

export class Wrapper {
    constructor(type) { // config
        this.children = []
        this.root = document.createElement(type)
    }
    setAttribute(name, value) { // attribute
        this.root.setAttribute(name, value)
        if (name === 'enableGesture') {
          enableGesture(this.root);
        }
        if (name.match(/^on([\s\S]+)$/)) {
          let eventName = RegExp.$1.replace(/[\s\S]/, (c) => c.toLowerCase())
          this.addEventListener(eventName, value);
        }
    }

    getAttribute(name) { // attribute
      return this.root.getAttribute(name)
    }

    appendChild(child) { // children
        this.children.push(child)
    }

    addEventListener() {
        this.root.addEventListener(...arguments)
    }

    get style() {
        return this.root.style
    }

    mountTo(parent) {
        parent.appendChild(this.root)
        for (let child of this.children) {
            child.mountTo(this.root)
        }
    }
}

export class Text {
    constructor(text) { // config
        this.children = []
        this.root = document.createTextNode(text)
    }
    mountTo(parent) {
        parent.appendChild(this.root)
    }
}