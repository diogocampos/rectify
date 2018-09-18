export function $(selector) {
  return document.querySelector(selector)
}

export function throttle(eventHandler) {
  let frame = null
  return event => {
    if (frame) return;
    eventHandler(event)
    frame = requestAnimationFrame(() => { frame = null })
  }
}
