const css = require('css');

const EOF = Symbol('EOF')
let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack 

let rules = []

function addCssRules(text) {
  var ast = css.parse(text)
  console.log(JSON.stringify(ast, null, '   '))
  rules.push(...ast.stylesheet.rules)
}


function match(element, selector) {
  if(!selector || !element.attributes) {
    return false
  }
  if(selector.charAt(0) === '#') {
    let attr = element.attributes.filter(attr => attr.name === 'id')
    if(attr && attr[0] && attr[0].value === selector.replace('#', '')) {
      return true
    }
  } else if (selector.charAt(0) === '.') {
    let attr = element.attributes.filter(attr => attr.name === 'class')
    if(attr && attr[0] && attr[0].value === selector.replace('.', '')) {
      return true
    }
  } else if (selector.charAt(0) === '[' && selector.charAt[selector.length - 1] === ']') {
    let idx = selector.indexOf('=')
    let cssAttrName = selector.slice(1, idx);
    let cssAttrValue = selector.slice(idx + 1)
    let attr = element.attributes.filter(attr => attr.name === cssAttrName)
    if(attr && attr[0] && attr[0].value === cssAttrValue) {
      return true
    }
  } else {
    if(element.tagName === selector) {
      return true
    }
  }
}


function specificity(selector) {
  let p = [0,0,0,0]
  let selectorParts = selector.split(' ')
  for(let part of selectorParts) {
    if(part.charAt(0) === '#') {
      p[1] += 1
    } else if (part.charAt[0] === '.' ) {
      p[2] += 1
    } else {
      p[3] += 1
    }
  }
  return p
}


function compare(sp1, sp2) {
  if(sp1[0] -sp2[0]) {
    return sp1[0] -sp2[0]
  }
  if(sp1[1] -sp2[1]) {
    return sp1[1] -sp2[1]
  }
  if(sp1[2] -sp2[2]) {
    return sp1[2] -sp2[2]
  }
  return sp1[3] -sp2[3]
}

function computeCss(element) {
  // console.log(rules)
  // console.log('compute CSS for Element', element)
  var elements = stack.slice().reverse()
  if(!element.computedStyle) {
    element.computedStyle = {}
  }
  for(let rule of rules) {
    var selectorParts = rule.selectors[0].split(' ').reverse()
    if(!match(element, selectorParts[0])) {
      continue
    }

    let matched = false

    var j = 1
    for(var i = 0; i < elements.length; i++) {
      if(match(elements[i]), selectorParts[j]) {
        j++
      }
    }
    if(j >= selectorParts.length) {
      matched = true
    }
    if(matched) {
      // 匹配到 rule ，加入 element
      // console.log(element, rule)
      let sp = specificity(rule.selectors[0])
      let computedStyle = element.computedStyle
      for(let declaration of rule.declarations) {
        if(!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        // console.log(computedStyle[declaration])
        if(!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
      console.log(element.computedStyle)
    }
  }

  // let inlineStyle = element.attributes.filter(p => p.name === 'style');
  // css.parse('* {' + inlineStyle + '}')
  // sp = [1,0,0,0]
  // for(...) {...}
}


function emit(token) {
  let top = stack[stack.length - 1]
  if(token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
    }

    element.tagName = token.tagName

    for(let p in token) {
      if(p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p],
        })
      }
    }

    computeCss(element)

    top.children.push(element)
    // element.parent = top

    if(!token.isSelfClosing) {
      stack.push(element)
    }
    
    currentTextNode = null
  } else if (token.type === 'endTag') {
    if(top.tagName !== token.tagName) {
      throw new Error('Tag start end doesn\'t match')
    } else {
      // 遇到 style 标签收集 css
      if(top.tagName === 'style') {
        addCssRules(top.children[0].content)
      }
      stack.pop()
    }
    currentTextNode = null
  } else if(token.type === 'text') {
    if(currentTextNode == null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }

  if(token.type !== 'text') {
    // console.log(token)
  }
}

function data(c) {
  if(c == '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c) {
  if(c === '/') {
    return endTagOpen;
  } else if(c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    return
  }
}

function endTagOpen(c) {
  if(c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if(c === '>') {

  } else if (c === EOF) {

  } else {

  }
}

function tagName (c) {
  if(c.match(/^[\t\f\n ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if(c.match(/^[a-zA-Z0-9]$/)) {
    currentToken.tagName += c // .toLowerCase() 加上不可以区分大小写 TAG 
    return tagName
  } else if(c === '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName (c) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if(c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    
  } else {
    currentAttribute = {
      value: '',
      name: ''
    }
    return attributeName(c)
  }
}

function afterAttributeName (c) {
  if(c === '/') {
    return selfClosingStartTag
  } else if(c === '=' || c === c.match(/^\t\f\n $/)) {
    return beforeAttributeValue
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c)
  }
}

function attributeName (c) {
  if(c.match(/^\t\f\n $/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === '\'' || c === '<') {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue (c) {
  if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if (c === '\"') {
    return doubleQuoteAttributeValue
  } else if (c === '\'') {
    return singleQuoteAttributeValue
  } else if (c === '>') {
    // return data
  } else {
    return UnquotedAttributeValue(c)
  }
}

function afterAttributeValue (c) {
  // if() {
  //   afterQuoteAttributeValue
  // }
}

function doubleQuoteAttributeValue(c) {
  if(c === '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuoteAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF ) {

  } else {
    currentAttribute.value += c
    return doubleQuoteAttributeValue
  }

}
function singleQuoteAttributeValue(c) {
  if(c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuoteAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF ) {

  } else {
    currentAttribute.value += c
    return singleQuoteAttributeValue
  }
}


function afterQuoteAttributeValue(c) {
  if(c.match(/^\t\n\f $/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuoteAttributeValue
  }
}

function UnquotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === '\'' || c === '<' || c === '=' || c === '`') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if(c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if(c === 'EOF') {

  } else {

  }
}

// parser 接收 HTML ，返回 DOM
export function parserHTML(html) {
  let state = data
  stack = [{ type: "document", children: [] }]
  for(let c of html) {
    state = state(c)
    // if(stack[stack.length - 1].tagName === 'script' && state = data) {

    // }
  }
  state = state(EOF)
  // console.log(currentToken)
  // console.log(JSON.stringify(stack))

  return stack[0]
}


// function match(pattern, string) {
//   if (pattern.length === 0) {
//     return true
//   }
//   const status = buildStatus(pattern)
//   let currentStatus = status[`match_${pattern[0]}`]
//   for(const char of string) {
//     currentStatus = status[currentStatus(char)]
//   }
//   return currentStatus === status.end
// }