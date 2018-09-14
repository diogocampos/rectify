const A4 = 210 / 297

async function rectifyImage(imageData, corners, ratio = A4) {
  const width = Math.max(
    distance(corners[0], corners[1]),
    distance(corners[2], corners[3])
  )
  const height = width / ratio

  const H = findHomography(corners, width, height)

  //...
  console.log(H)

  return imageData
}

function distance([x1, y1], [x2, y2]) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function findHomography(fromCorners, width, height) {
  const toCorners = [[0, 0], [width, 0], [width, height], [0, height]]
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
    [solution[6], solution[7], 1],
  ]
}

/**
 * Eliminação de Gauss-Jordan
 */

function gaussJordan(system) {
  for (let i = 0, len = system.length; i < len; i++) {
    const j = system.slice(i).findIndex(row => row[i] !== 0)
    if (j > 0) swapRows(system, i, i + j)

    divideRow(system[i], system[i][i])
    for (let j = i + 1; j < len; ++j) {
      addRow(system[j], system[i], -system[j][i])
    }
  }

  for (let i = system.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      addRow(system[j], system[i], -system[j][i])
    }
  }

  return system.map(row => row[row.length - 1])
}

function swapRows(matrix, i, j) {
  const temp = matrix[i]
  matrix[i] = matrix[j]
  matrix[j] = temp
}

function divideRow(row, divisor) {
  for (let i = 0, len = row.length; i < len; i++) {
    row[i] /= divisor
  }
}

function addRow(toRow, fromRow, scale) {
  for (let i = 0, len = toRow.length; i < len; i++) {
    toRow[i] += scale * fromRow[i]
  }
}
