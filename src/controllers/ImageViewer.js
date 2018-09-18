import Canvas from './Canvas'

class ImageViewer extends Canvas {
  loadFile(imageFile) {
    return new Promise(resolve => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = URL.createObjectURL(imageFile)
      image.onload = () => {
        URL.revokeObjectURL(image.src)
        this.resize(image.width, image.height)
        this.ctx.drawImage(image, 0, 0)
        resolve()
      }
    })
  }

  getImageData() {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }

  loadImageData(imageData) {
    this.resize(imageData.width, imageData.height)
    this.ctx.putImageData(imageData, 0, 0)
  }

  renderProgress(progress) {
    const width = 256, height = 16
    this.resize(width, height)

    this.ctx.strokeStyle = '#ccd'
    this.ctx.fillStyle = '#ccd'
    this.ctx.clearRect(0, 0, width, height)
    this.ctx.strokeRect(0, 0, width, height)
    this.ctx.fillRect(2, 2, progress * (width - 4), height - 4)
  }
}

export default ImageViewer
