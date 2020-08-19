export function enableGesture(element) {
  let contexts = Object.create(null);
  let MOUSE_SYMBOL = Symbol('MOUSE')
  element.addEventListener('mousedown', (event) => {
    contexts[MOUSE_SYMBOL] = Object.create(null);
    start(event, contexts[MOUSE_SYMBOL]);
    let mouseend = (event) => {
      end(event, contexts[MOUSE_SYMBOL]);
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseend);
    }
    let mousemove = (event) => {
      move(event, contexts[MOUSE_SYMBOL]);
    }

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseend);
  })

  element.addEventListener('touchstart', (e) => {
    for (let touch of e.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier])
    }
  })
  element.addEventListener('touchmove', (e) => {
    for (let touch of e.changedTouches) {
      move(touch, contexts[touch.identifier])
    }
  })
  element.addEventListener('touchend', (e) => {
    for (let touch of e.changedTouches) {
      end(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })
  element.addEventListener('touchcancel', (e) => {
    for (let touch of e.changedTouches) {
      cancel(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })

  let start = (point, context) => {
    element.dispatchEvent(
      new CustomEvent('start',
        { detail: { startX: point.clientX, startY: point.clientY }}
      )
    );
    context.startX = point.clientX, context.startY = point.clientY;
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.points = [];
    context.timeoutHandler = setTimeout(() => {
      if (context.isPan) return;
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      element.dispatchEvent(
        new CustomEvent('pressstart',
          { detail: {}}
        )
      );
    }, 500);

    
  }
  let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy **2 > 100) {
      if (context.isPress) {
        element.dispatchEvent(
          new CustomEvent('pressend',
            { detail: {}}
          )
        );
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      element.dispatchEvent(
        new CustomEvent('panstart',
          { detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY
          }}
        )
      );
    }
    if (context.isPan) {
      context.points.push({
        point,
        timestamp: Date.now()
      });
      element.dispatchEvent(
        new CustomEvent('pan',
          { detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY
          }}
        )
      );
      context.points = context.points.filter(point => point.timestamp - Date.now() < 300)
      clearTimeout(context.timeoutHandler)
    }
  }
  let end = (point, context) => {
    
    
    if (context.isPan) {
      let { point: p, timestamp } = context.points[0]
      let speed = Math.sqrt((p.clientY - point.clientY) ** 2 + (p.clientX - point.clientX) ** 2) / (Date.now() - timestamp)
      let isFlick = speed > 1.5;
      if (isFlick) {
        element.dispatchEvent(
          new CustomEvent('flick',
            { detail: {
              startX: context.startX,
              startY: context.startY,
              clientX: point.clientX,
              clientY: point.clientY,
              speed
            }}
          )
        );
      } else {
        element.dispatchEvent(
          new CustomEvent('panend',
            { detail: {
              startX: context.startX,
              startY: context.startY,
              clientX: point.clientX,
              clientY: point.clientY,
              speed,
            }}
          )
        );
      }
    }
    if (context.isTap) {
      element.dispatchEvent(
        new CustomEvent('tapend',
          { detail: {}}
        )
      );
    }
    if (context.isPress) {
      element.dispatchEvent(
        new CustomEvent('pressend',
          { detail: {}}
        )
      );
    }
    clearTimeout(context.timeoutHandler)
  }
  let cancel = (point, context) => {
    element.dispatchEvent(
      new CustomEvent('canceled',
        { detail: {}}
      )
    );
    clearTimeout(context.timeoutHandler)
  }
}