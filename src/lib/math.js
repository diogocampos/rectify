/**
 * Distância Euclidiana
 */

export function distance([x1, y1], [x2, y2]) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

/**
 * Eliminação de Gauss-Jordan
 */

export function gaussJordan(system) {
  // https://en.wikipedia.org/wiki/Gaussian_elimination

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

/**
 * Multiplicação matricial
 */

export function transform(matrix, vector) {
  const result = []
  for (let i = 0, len = matrix.length; i < len; i++) {
    result.push(dotProduct(matrix[i], vector))
  }
  return result
}

function dotProduct(a, b) {
  let result = 0
  for (let i = 0, len = a.length; i < len; i++) {
    result += a[i] * b[i]
  }
  return result
}
