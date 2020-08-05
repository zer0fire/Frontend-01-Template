import Wrapper from './Wrapper';
import Text from './Text';

class Child {
  constructor (config) {
    this.children = []
    this.root = document.createElement('div')
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    this.children.push(child)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

export default function createElement(Cls, attributes, ...children) {
  // console.log(arguments)
  let o
  if(typeof Cls === 'string' ) {
    o = new Wrapper(Cls)
  } else {
    o = new Cls({
      timer: {}
    })
  }
  for(let name in attributes) {
    // o[name] = attributes[name]
    o.setAttribute(name, attributes[name])
  }

  for(let child of children) {
    if (typeof child === 'string') {
      // console.log(child)
      child = new Text(child)
    }
    if(typeof Child)
    o.appendChild(child)
  }

  // console.log(children)

  return o
}
