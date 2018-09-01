window.onload = () => {
  const fileInput = document.getElementById('file-input')
  let fileInfo = null

  const applyButton = document.getElementById('apply-button')
  const saveButton = document.getElementById('save-button')

  const inputImage = new ImageCanvas('canvas#input-image')
  const outputImage = new ImageCanvas('canvas#output-image')

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

    await inputImage.loadImage(imageFile)
    applyButton.hidden = false
  }

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

class ImageCanvas {
  constructor(selector) {
    this.canvas = document.querySelector(selector)
    this.ctx = this.canvas.getContext('2d')
  }

  loadImage(imageFile) {
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
