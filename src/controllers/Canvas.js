class Canvas {
  constructor(canvasElement) {
    this.canvas = canvasElement
    this.ctx = this.canvas.getContext('2d')
  }

  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export default Canvas
