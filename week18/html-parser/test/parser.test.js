import { parserHTML } from '../src/parser'
let assert = require('assert')

describe('test parserHTML', () =>{
  it('parse a single element', () => {
    let doc = parserHTML('<div></div>')
    let div = doc.children[0]
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
      let doc = parserHTML('<div>hello</vdiv>')
    } catch(e) {
      console.log(e)
      assert.equal(e.message, `Tag start end doesn't match`)
    }
  })

  it('text with <', () => {
      let doc = parserHTML('<div>a < b</div>')
      let text = doc.children[0].children[0]
      assert.equal(text.content, "a < b")
      assert.equal(text.type, 'text')
  })


  it('with property', () => {
      let doc = parserHTML(`<div id="a" class="cls" data="abc"></div>`)
      let div = doc.children[0]
      let count = 0
      for(let attr of div.attributes) {
        if(attr.name === 'id') {
          count++
          assert.equal(attr.value, 'text')
          return
        }
        if(attr.name === 'class') {
          count++
          assert.equal(attr.value, 'cls')
          return
        }
        if(attr.name === 'data') {
          count++
          assert.equal(attr.value, 'abc')
          return
        }
      }
      assert.ok(count === 3)
  })

  it('with double quoted property', () => {
      let doc = parserHTML(`<div id="a" class="cls" data="abc"></div>`)
      let div = doc.children[0]
      let count = 0
      for(let attr of div.attributes) {
        if(attr.name === 'id') {
          count++
          assert.equal(attr.value, 'text')
          return
        }
        if(attr.name === 'class') {
          count++
          assert.equal(attr.value, 'cls')
          return
        }
        if(attr.name === 'data') {
          count++
          assert.equal(attr.value, 'abc')
          return
        }
      }
      assert.ok(count === 3)
  })

  it('unquoted attribute', () => {
    let doc = parserHTML('<div id=a></div>')
    let div = doc.children[0]
    let count = 0
    for (let attr of div.attributes) {
      if (attr.name === 'id') {
        count += 1
        assert.equal(attr.value, 'a')
      }
    }
    assert.equal(count, 1)
  })

  it('selfclose tag', () => {
    let doc = parserHTML('<img/>')
    let img = doc.children[0]
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        assert.equal(attr.value, true)
        return false
      }
    }
    assert.ok(false)
  })
  it('selfclose tag with double quoted attribute', () => {
    let doc = parserHTML('<img class="a"/>')
    let img = doc.children[0]
    let count = 0
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        count += 1
        assert.equal(attr.value, true)
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'a')
      }
    }
    assert.equal(count, 2)
  })
  it('selfclose tag with single quoted attribute', () => {
    let doc = parserHTML('<img class=\'a\'/>')
    let img = doc.children[0]
    let count = 0
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        count += 1
        assert.equal(attr.value, true)
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'a')
      }
    }
    assert.equal(count, 2)
  })
  it('selfclose tag with unquoted attribute', () => {
    let doc = parserHTML('<img class=a/>')
    let img = doc.children[0]
    let count = 0
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        count += 1
        assert.equal(attr.value, true)
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'a')
      }
    }
    assert.equal(count, 2)
  })
  it('selfclose tag with no value attribute', () => {
    let doc = parserHTML('<img required/>')
    let img = doc.children[0]
    let count = 0
    for(let attr of img.attributes) {
      if (attr.name === 'isSelfClosing') {
        count += 1
        assert.equal(attr.value, true)
      }
      if (attr.name === 'required') {
        count += 1
        assert.equal(attr.value, '')
      }
    }
    assert.equal(count, 2)
  })
  it('selfclose tag less >', () => {
    try {
      let doc = parserHTML('<img/')
    } catch(err) {
      assert.equal(err.message, 'unexpected-solidus-in-tag parse error')
    }
  })

  it('script', () => {
    let content = `<div>abc</div>
      <span>xx</span>
      /script>
      <</</s<sc</scr</scri</scrip</script
      <
      </
      </s
      </sc
      </scr
      </scri
      </scrip
      </script`
    let doc = parserHTML(`<script>${content}</script>`)
    let script = doc.children[0]
    let text = script.children[0]
    assert.equal(text.type, 'text')
    assert.equal(text.content, content)
  })
})