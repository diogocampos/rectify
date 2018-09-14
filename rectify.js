const A4 = 210 / 297

async function rectifyImage(imageData, corners, ratio = A4) {
  const width = Math.max(
    distance(corners[0], corners[1]),
    distance(corners[2], corners[3])
  )
  const height = width / ratio

  const H = findHomography(corners, width, height)
  console.log(H)

  //...

  return imageData
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
  return gaussJordan(system)
}

function gaussJordan(system) {
  // TODO: aplicar eliminação de Gauss-Jordan, retornar solução
  return system.map(row => row[row.length - 1])
}

function distance([x1, y1], [x2, y2]) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
