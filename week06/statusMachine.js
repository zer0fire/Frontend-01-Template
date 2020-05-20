  
// 匹配字符abababx

function match(str) {
  let state = start
  for(let c of str) {
    state = state(c)
  }
  return state === end
}

function start(c) {
  if(c === 'a') {
    return foundA1
  } else {
    return start
  }
}

function end(c) {
  return end
}

function foundA1(c) {
  if(c === 'b') {
    return foundB2
  } else {
    return start(c)
  }
}
function foundB2(c) {
  if(c === 'a') {
    return foundA3
  } else {
    return start(c)
  }
}
function foundA3(c) {
  if(c === 'b') {
    return foundB4
  } else {
    return start(c)
  }
}

function foundB4(c) {
  if(c === 'a') {
    return foundA5
  } else {
    return start(c)
  }
}
function foundA5(c) {
  if(c === 'b') {
    return foundB6
  } else {
    return start(c)
  }
}
function foundB6(c) {
  if(c === 'x') {
    return end
  } else {
    return foundB4
  }
}

// 思考过程：
// 开始匹配，如果第一位命中，从 foundA1 开始匹配；第一位未命中，从头开始匹配
// 匹配了a, 第二位未命中则退回到start开始，并带上当前匹配字符，形成状态机的 Resume，从头开始匹配
// 匹配了ab, 第三位未命中则退回到start开始，并带上当前匹配字符
// 匹配了aba, 第四位未命中则退回到start开始，并带上当前匹配字符，因为第四位未命中，则能确定肯定不是b，那么aba里的最后一个a也不用留下了，所以需要从start开始。
// 匹配了abab, 第五位未命中则退回到start开始，并带上当前匹配字符，因为第五位未命中，则能确定肯定不是a，那么abab里的最后两位ab也不用留下了，所以需要从start开始。
// 匹配了ababa, 第六位未命中则退回到start开始，并带上当前匹配字符，因为第六位未命中，则能确定肯定不是b，那么ababa里的最后三位aba也不用留下了，所以需要从start开始。
// 匹配了ababab, 第七位未命中则退回到abab模式，因为第七位未命中不是x，有可能是a，且状态机里只能处理一种状态，那么就将ababab里的最后四位abab留下，所以从abab开始。
console.log(match('ab abcd abcdaa aabcdef abcabx abababx')) // true
console.log(match('ab abcd abcdaa aabcdef abcabx ababab')) // false
