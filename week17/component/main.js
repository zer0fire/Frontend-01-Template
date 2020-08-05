// import './foo.js'
function createElement(Cls, attributes, ...children) {
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

class Text {
  constructor (text) {
    this.root = document.createTextNode(text)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}


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

class Parent {
  // set class (v) {
  //   console.log('Parent::class ' + v)
  // }
  constructor (config) {
    // console.log('config ', config)
    this.children = []
    this.root = document.createElement('div')
  }

  setAttribute(name, value) {
    // console.log(name, value)
    // this[name] = value
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    this.children.push(child)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

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

class Div {
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
    for(let child of this.children) {
      if (typeof child === 'string') {
        // console.log(child)
        child = new Text(child)
      }
      child.mountTo(this.root)
    }
  } 
}

class MyComponent {
  constructor (config) {
    this.children = []
    this.root = document.createElement('div')
    this.attributes = new Map()
    this.properties = new Map()
  }

  setAttribute(name, value) {
    // this.root.setAttribute(name, value)
    this.attributes.set(name, value)
  }
  appendChild(child) {
    this.children.push(child)
  }
  set title(value) {
    this.properties.set('title', value)
  }

  render () {
    return <article>
      <h1>{ this.attributes.get('title') }</h1>
      <h2>{ this.properties.get('title') }</h2>
      <header>I'm a header</header>
      {this.slot}
      <footer>I'm a footer</footer>
    </article>
  }

  mountTo(parent) {
    this.slot = <div></div>
    for(let child of this.children) {
      this.slot.appendChild(child)
    }
    // parent.appendChild(this.root)
    this.render().mountTo(parent)

  } 
}

// let compnent = <div id="a" cls="b" style="width:100px;height:100px;background-color: lightgreen" >
//   <p id="c1" ></p>
//   <div id="c2" ></div>
//   <div id="c3" ></div>
// </div>
// let compnent = <div>text</div>
let compnent = <MyComponent title="I'm a title">
  <div>test test test</div>
</MyComponent>
compnent.title = "I'm title 2"
// compnent.class = 'c'

// let component = createElement(
//     Parent,
//     {
//       id: 'a',
//       'class': 'b',
//     },
//     createElement(Child, null),
//     createElement(Child, null),
//     createElement(Child, null),
//   )

// console.log(compnent)
compnent.mountTo(document.body)

// compnent.id = 'b'
// compnent.setAttribute('id', 'a')



