/**
 * Inicialização
 */

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

    await inputImage.loadFile(imageFile)
    regionSelector.resize(inputImage.canvas.width, inputImage.canvas.height)
    applyButton.hidden = false
  }

  window.addEventListener('resize', () => {
    regionSelector.render()
  })

  applyButton.addEventListener('click', async () => {
    saveButton.hidden = true
    outputImage.clear()

    const rectifiedImageData = await rectifyImage(
      inputImage.getImageData(),
      regionSelector.corners,
      { onProgress: progress => outputImage.renderProgress(progress) }
    )

    outputImage.loadImageData(rectifiedImageData)
    saveButton.hidden = false
  })

  saveButton.addEventListener('click', () => {
    saveButton.href = outputImage.canvas.toDataURL(fileInfo.type)
    saveButton.download = addSuffix(fileInfo.name, 'retificada')
  })
}

/**
 * Componentes
 */

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

class RegionSelector extends Canvas {
  constructor(canvasElement) {
    super(canvasElement)

    this.corners = [[-100, -100]]
    this.hoverCorner = null
    this.activeCorner = null

    const getMouseCoords = event => [
      this.scale * event.offsetX,
      this.scale * event.offsetY
    ]

    const getCornerNearCoords = coords => {
      for (let index = 0, len = this.corners.length; index < len; index++) {
        const corner = this.corners[index]
        if (distance(coords, corner) / this.scale < 12) return index
      }
      return null
    }

    this.canvas.addEventListener('mousemove', throttle(event => {
      if (this.activeCorner !== null) {
        this.corners[this.activeCorner] = getMouseCoords(event)
      } else {
        this.hoverCorner = getCornerNearCoords(getMouseCoords(event))
      }
      this.render()
    }))

    this.canvas.addEventListener('mousedown', () => {
      if (this.hoverCorner !== null) {
        this.activeCorner = this.hoverCorner
      }
    })

    this.canvas.addEventListener('mouseup', () => {
      this.activeCorner = null
    })

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverCorner = null
      this.activeCorner = null
      this.render()
    })
  }

  resize(width, height) {
    super.resize(width, height)

    const left = 0.2 * width, right = 0.8 * width
    const top = 0.2 * height, bottom = 0.8 * height
    this.corners = [[left, top], [right, top], [right, bottom], [left, bottom]]

    this.render()
  }

  render() {
    this.scale = this.canvas.width / this.canvas.clientWidth
    this.ctx.lineWidth = this.scale * 5
    this.ctx.strokeStyle = '#18f'
    this.ctx.fillStyle = '#18f'

    this.clear()
    this.ctx.beginPath()
    this.ctx.moveTo(...this.corners[0])
    this.corners.slice(1).forEach(corner => this.ctx.lineTo(...corner))
    this.ctx.closePath()
    this.ctx.stroke()

    this.corners.forEach(([x, y], index) => {
      if (this.hoverCorner === index) {
        this.ctx.save()
        this.ctx.fillStyle = '#3af'
      }

      this.ctx.beginPath()
      this.ctx.arc(x, y, this.scale * 8, 0, 2 * Math.PI)
      this.ctx.fill()

      if (this.hoverCorner === index) {
        this.ctx.restore()
      }
    })
  }
}

/**
 * Funções auxiliares
 */

function $(selector) {
  return document.querySelector(selector)
}

function addSuffix(fileName, suffix) {
  const parts = fileName.split('.')
  if (parts.length > 1) {
    const name = parts.slice(0, -1).join('.')
    const extension = parts[parts.length - 1]
    return `${name}-${suffix}.${extension}`
  } else {
    return `${fileName}-${suffix}`
  }
}

function throttle(eventHandler) {
  let frame = null
  return event => {
    if (frame) return;
    eventHandler(event)
    frame = requestAnimationFrame(() => { frame = null })
  }
}
