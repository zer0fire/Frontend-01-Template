export function createEle(Cls, attributes, ...children) {
  //  处理组件小写问题
  let o;
  if(typeof Cls === 'string') {
    o = new Wrapper(Cls)
  } else {
    o = new Cls({ timer: {} })
  }
}