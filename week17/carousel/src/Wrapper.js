class Wrapper {
  constructor (type) {
    this.children = []
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    this.children.push(child)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
    for(let child of this.children) {
      console.log(child)
      child.mountTo(this.root)
    }
  }
}