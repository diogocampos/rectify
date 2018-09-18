import { distance, gaussJordan, transform } from './math'
import { getInterpolatedPixel, setPixel } from './pixels'

/**
 * Retificação
 */

const A4 = 210 / 297

export function rectifyImage(
  imageData,
  corners,
  { ratio = A4, onProgress } = {}
) {
  const maxWidth = Math.max(
    distance(corners[0], corners[1]),
    distance(corners[2], corners[3])
  )
  const width = Math.round(maxWidth)
  const height = Math.round(maxWidth / ratio)

  const H = findHomography(corners, width, height)
  return applyHomography(imageData, H, width, height, onProgress)
}

function findHomography(toCorners, width, height) {
  const fromCorners = [[0, 0], [width, 0], [width, height], [0, height]]
  const system = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = fromCorners[i]
    const [u, v] = toCorners[i]
    system.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
    system.push([0, 0, 0, x, y, 1, -v * x, -v * y, v])
  }

  const solution = gaussJordan(system)
  return [
    [solution[0], solution[1], solution[2]],
    [solution[3], solution[4], solution[5]],
    [solution[6], solution[7],         1.0],
  ]
}

async function applyHomography(imageData, H, width, height, onProgress) {
  const result = new ImageData(width, height)

  for (let y = 0; y < height; y++) {
    if (y % 10 === 0) {
      if (onProgress) onProgress(y / height)
      await nextTick()
    }

    for (let x = 0; x < width; x++) {
      const [u, v] = transform(H, [x, y, 1.0])
      setPixel(result, x, y, getInterpolatedPixel(imageData, u, v))
    }
  }

  return result
}

function nextTick() {
  return new Promise(resolve => setTimeout(resolve, 0))
}
