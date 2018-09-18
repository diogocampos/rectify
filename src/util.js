export function $(selector) {
  return document.querySelector(selector)
}

export function distance([x1, y1], [x2, y2]) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

export function throttle(eventHandler) {
  let frame = null
  return event => {
    if (frame) return;
    eventHandler(event)
    frame = requestAnimationFrame(() => { frame = null })
  }
}
