window.onload = () => {
  const fileInput = document.getElementById('file-input')
  const adjustButton = document.getElementById('adjust-button')
  const saveButton = document.getElementById('save-button')

  const inputCanvas = new Canvas('input-image')
  const outputCanvas = new Canvas('output-image')

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
    inputCanvas.clear()
    outputCanvas.clear()
    adjustButton.hidden = true
    saveButton.hidden = true

    await inputCanvas.loadImage(imageFile)
    adjustButton.hidden = false
  }
}

class Canvas {
  constructor(id) {
    this._canvas = document.getElementById(id)
    this._ctx = this._canvas.getContext('2d')
  }

  loadImage(imageFile) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(imageFile)
      const image = new Image()
      image.src = url
      image.onload = () => {
        URL.revokeObjectURL(url)
        this._canvas.width = image.width
        this._canvas.height = image.height
        this._ctx.drawImage(image, 0, 0)
        resolve()
      }
    })
  }

  clear() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }
}
