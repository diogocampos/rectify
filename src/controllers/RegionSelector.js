import Canvas from './Canvas'
import { distance } from '../lib/math'
import { throttle } from '../lib/util'

class RegionSelector extends Canvas {
  constructor(canvasElement) {
    super(canvasElement)

    this.corners = [[-100, -100]]
    this.hoverCorner = null
    this.activeCorner = null

    const getMouseCoords = event => [
      this.scale * event.offsetX,
      this.scale * event.offsetY,
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

export default RegionSelector
