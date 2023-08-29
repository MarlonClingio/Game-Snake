const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const audioFood = new Audio('../Sound/snake-food.mp3')
const audioGame = new Audio('../Sound/heavy-rain.mp3')
const score = document.querySelector('.score_value')
const finalScore = document.querySelector('.final_score > span')
const menu = document.querySelector('.menu_screen')
const buttonPlay = document.querySelector('.btn_play');

const size = 30;

let snake = [
  { x: 300, y: 300 }
]

const initialPosition = [
  { x: 300, y: 300 }
]

const increementScore = () => {
  score.innerText = parseInt(score.innerText) + 10
}

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size)
  return Math.round(number / 30) * 30
}

const randomColor = () => {
  const red = randomNumber(0, 255)
  const grenn = randomNumber(0, 255)
  const blue = randomNumber(0, 255)

  return `rgb(${red}, ${grenn}, ${blue})`
}

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
}

let direction, loodId

const drawFood = () => {

  const { x, y, color } = food

  ctx.shadowColor = color
  ctx.shadowBlur = 15
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}

const drawSnake = () => {
  ctx.fillStyle = '#ddd'

  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = '#fff'
    }

    ctx.fillRect(position.x, position.y, size, size)
  })
}

const moveSnake = () => {
  if (!direction) return

  const head = snake[snake.length - 1]

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y })
  }
  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y })
  }
  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size })
  }
  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size })
  }

  snake.shift()
}

const drawGrid = () => {

  ctx.lineWidth = 1
  ctx.strokeStyle = "#222"

  for (let i = size; i < canvas.width; i += size) {
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()
  }
}

const chackEat = () => {
  const head = snake[snake.length - 1]

  if (head.x == food.x && head.y == food.y) {
    increementScore()
    snake.push(head)
    audioFood.play()
    let x = randomPosition()
    let y = randomPosition()

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition()
      y = randomPosition()
    }

    food.x = x
    food.y = y
    food.color = randomColor()

  }
}

const checkCollision = () => {
  const head = snake[snake.length - 1]
  const canvasLimite = canvas.width - size
  const neckIndex = snake.length - 2

  const wallCollision = head.x < 0 || head.x > canvasLimite || head.y < 0 || head.y > canvasLimite

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y
  })

  if (wallCollision || selfCollision) {
    gameOver()
  }
}

const gameOver = () => {
  direction = undefined

  menu.style.display = "flex"
  finalScore.innerText = score.innerText
  canvas.style.filter = "blur(3px)"
}

const gameLoop = () => {
  clearInterval(loodId)

  ctx.clearRect(0, 0, 600, 600)
  drawGrid()
  drawFood()
  moveSnake()
  drawSnake()
  chackEat()
  checkCollision()

  loodId = setTimeout(() => {
    gameLoop()
  }, 300)

  audioGame.play()
}

gameLoop()

document.addEventListener('keydown', ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right"
  }
  if (key == "ArrowLeft" && direction != "right") {
    direction = "left"
  }
  if (key == "ArrowUp" && direction != "down") {
    direction = "up"
  }
  if (key == "ArrowDown" && direction != "up") {
    direction = "down"
  }
})

buttonPlay.addEventListener("click", () => {
  score.innerText = "00"
  menu.style.display = "none"
  canvas.style.filter = "none"

  snake = [initialPosition]
})