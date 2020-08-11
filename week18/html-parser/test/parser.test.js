import { parserHTML } from '../src/parser'
let assert = require('assert')

it('parse a single element', () => {
  let doc = parserHTML('<div></div>')
  let div = doc[0].children[0]
  console.log(div)
  assert.equal(div.tagName, 'div')
  assert.equal(div.children.length, 0)
  assert.equal(div.type, 'element')
  assert.equal(div.attributes.length, 2)
  
})

it('parse a single with text content', () => {
  let doc = parserHTML('<div>hello</div>')
  let div = doc.children[0]
  let text = div.children[0]
  assert.equal(text.content, 'hello')
  assert.equal(text.type, 'text')
})

it('tag mismatch', () => {
  try {
    let doc = parserHTML('<div>hello</div>')
  } catch(e) {
    console.log(e)
    assert.equal(e.message, `Tag start end doesn't match`)
  }
})

it('text with <', () => {
    let doc = parserHTML('<div>a < b</div>')
    let text = doc.children[0].children[0]

})