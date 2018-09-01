const $ = selector => document.querySelector(selector)

window.onload = () => {
  const fileInput = $('#file-input')
  let fileInfo = null

  const applyButton = $('#apply-button')
  const saveButton = $('#save-button')

  const inputImage = new ImageViewer($('canvas#input-image'))
  const regionSelector = new RegionSelector($('canvas#region-selector'))
  const outputImage = new ImageViewer($('canvas#output-image'))

  fileInput.addEventListener('change', event => {
    const imageFile = event.target.files[0]
    loadInputImage(imageFile)
  })

  document.body.addEventListener('dragover', event => {
    event.preventDefault()
  })

  document.body.addEventListener('drop', event => {
    event.preventDefault()
    const imageFile = Array.prototype.filter.call(
      event.dataTransfer.files,
      file => /^image\//.test(file.type)
    )[0]
    event.dataTransfer.clearData()
    loadInputImage(imageFile)
  })

  async function loadInputImage(imageFile) {
    fileInfo = { name: imageFile.name, type: imageFile.type }

    inputImage.clear()
    outputImage.clear()
    applyButton.hidden = true
    saveButton.hidden = true
    saveButton.href = ''

    await inputImage.load(imageFile)
    regionSelector.resize(inputImage.canvas.width, inputImage.canvas.height)
    applyButton.hidden = false
  }

  window.addEventListener('resize', () => {
    regionSelector.render()
  })

  applyButton.addEventListener('click', () => {
    // TODO: Aplicar homografia planar à região selecionada

    saveButton.hidden = false
  })

  saveButton.addEventListener('click', () => {
    saveButton.href = outputImage.canvas.toDataURL(fileInfo.type)
    saveButton.download = adjusted(fileInfo.name)
  })
}

function adjusted(fileName) {
  const parts = fileName.split('.')
  if (parts.length > 1) {
    const name = parts.slice(0, -1).join('.')
    const extension = parts[parts.length - 1]
    return `${name}-ajustado.${extension}`
  } else {
    return `${fileName}-ajustado`
  }
}

class Canvas {
  constructor(canvasElement) {
    this.canvas = canvasElement
    this.ctx = this.canvas.getContext('2d')
  }
}

class ImageViewer extends Canvas {
  load(imageFile) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(imageFile)
      const image = new Image()
      image.src = url
      image.onload = () => {
        URL.revokeObjectURL(url)
        this.canvas.width = image.width
        this.canvas.height = image.height
        this.ctx.drawImage(image, 0, 0)
        resolve()
      }
    })
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

class RegionSelector extends Canvas {
  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height

    const left = 0.25 * width
    const right = 0.75 * width
    const top = 0.25 * height
    const bottom = 0.75 * height
    this.corners = [[left, top], [right, top], [right, bottom], [left, bottom]]

    this.render()
  }

  render() {
    const scale = this.canvas.width / this.canvas.clientWidth
    this.ctx.lineWidth = 5 * scale
    this.ctx.strokeStyle = '#18f'
    this.ctx.fillStyle = '#18f'

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.beginPath()
    this.ctx.moveTo(...this.corners[0])
    this.corners.slice(1).forEach(corner => this.ctx.lineTo(...corner))
    this.ctx.closePath()
    this.ctx.stroke()

    this.corners.forEach(([x, y]) => {
      this.ctx.beginPath()
      this.ctx.arc(x, y, 10 * scale, 0, 2 * Math.PI)
      this.ctx.fill()
    })
  }
}
