function getPixel(imageData, x, y) {
  const i = (y * imageData.width + x) * 4
  return imageData.data.slice(i, i + 4)
}

export function setPixel(imageData, x, y, rgba) {
  const i = (y * imageData.width + x) * 4
  for (let j = 0; j < 4; j++) {
    imageData.data[i + j] = rgba[j]
  }
}

export function getInterpolatedPixel(imageData, x, y) {
  // https://en.wikipedia.org/wiki/Bilinear_interpolation

  const x1 = Math.floor(x), x2 = x1 + 1, dx1 = x - x1, dx2 = x2 - x
  const y1 = Math.floor(y), y2 = y1 + 1, dy1 = y - y1, dy2 = y2 - y

  const p11 = getPixel(imageData, x1, y1)
  const p21 = getPixel(imageData, x2, y1)
  const p12 = getPixel(imageData, x1, y2)
  const p22 = getPixel(imageData, x2, y2)

  const pixel = [0, 0, 0, 0]
  for (let i = 0; i < 4; i++) {
    const fy1 = dx2 * p11[i] + dx1 * p21[i]
    const fy2 = dx2 * p12[i] + dx1 * p22[i]
    pixel[i] = Math.round(dy2 * fy1 + dy1 * fy2)
  }
  return pixel
}
