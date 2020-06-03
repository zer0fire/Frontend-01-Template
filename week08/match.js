function match (element, selector) {
  if (!selector || !element.attributes)
    return false
  let regClass = /(\.\w+)+/g
  let regId = /(#\w+)+/g

  let resClass = selector.match(regClass)
  let resId = selector.match(regId)

  if(resClass) {
    let resClassArr = []
    for(let i = 0; i < resClass.length; i++) {
      let tempArr = resClass[i].split('.')
      for(let j = 1; j < tempArr.length; j++) {
        resClassArr.push(tempArr[j])
      }
    }

    let classAttr = element.attributes.filter(attr => attr.name === 'class')
    let classAttrRes = []
    if(classAttr && classAttr[0]) {
      classAttrRes = classAtt[0]['value'].split(' ')
    }
    let tempFlag = null
    for(let i = 0; i < resClassArr.length; i++) {
      tempFlag = false
      let k = 0
      for(; k < classAttrRes.length; k++) {
        if(classAttrRes[k] === resClassArr[i]) {
          tempFlag = true
          break
        }
      }
      if(!tempFlag && k === classAttrRes.length) {
        return false
      }
    }
  }

  if(resId && resId[0].charAt(0) === '#') {
    const attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if(attr && attr.val === resId[0].replace('#', '')) {
      return true
    } else {
      return false
    }
  } else if (selector.charAt(0) !== '#' && selector.charAt(0) !== '.') {
    if(element.tagName === selector) {
      return true
    } else {
      return false
    }
  } else if (resClass && resClass.length) {
    return true
  }
  return false
}
