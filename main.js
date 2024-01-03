const screen = document.getElementById('screen')
let score = document.getElementById('score')
const ctx = screen.getContext('2d')
const map = [
  [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
  [[1], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
  [[1], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
  [[1], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
  [[1], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
  [[1], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
  [[1], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
  [[1], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
  [[1], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
  [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1]]
]
screen.height = map.length * 20;
screen.width = map[0].length * 20;
class GameMap {
  build() {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const cellValue = map[y][x];
        ctx.fillStyle = Number(cellValue) === 1 ? 'black' : 'white';
        ctx.fillRect(x * 20, y * 20, 20, 20)
      }
    }
  }
  restart(){

  }
}

class Fruit {
  generateFruit() {
    const emptyPosition = [];
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (Number(map[y][x]) === 0) {
          emptyPosition.push({ y, x });
        }
      }
    }
    if (emptyPosition.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyPosition.length);

      
      this.position = emptyPosition[randomIndex];
    }
  }

  render() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.position.x * 20, this.position.y * 20, 20, 20);
  }
}

class Player {
  constructor() {
    this.length = 1;
    this.segments = [{ x: 5, y: 5 }];
    this.direction = 'ArrowRight'
    this.interval = 250
  }
  getInterval(){
    const interval = this.interval
    return interval
  }
  move() {
      switch (this.direction) {
        case 'ArrowRight':
          this.segments.unshift({ x: this.segments[0].x + 1, y: this.segments[0].y });
          this.segments.pop()
          break;
        case 'ArrowUp':
          this.segments.unshift({ x: this.segments[0].x, y: this.segments[0].y - 1 });
          this.segments.pop()
          break;
        case 'ArrowDown':
          this.segments.unshift({ x: this.segments[0].x, y: this.segments[0].y + 1 });
          this.segments.pop()
          break;
        case 'ArrowLeft':
          this.segments.unshift({ x: this.segments[0].x - 1, y: this.segments[0].y });
          this.segments.pop()
          break;
        default:
          break;
      }
  }
  changeMove(){
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowRight':
          this.direction === 'ArrowLeft' ? null : this.direction = 'ArrowRight'
          break;
        case 'ArrowUp':
          this.direction === 'ArrowDown' ? null : this.direction = 'ArrowUp'
          break;
        case 'ArrowDown':
          this.direction === 'ArrowUp' ? null : this.direction = 'ArrowDown'
          break;
        case 'ArrowLeft':
          this.direction === 'ArrowRight' ? null : this.direction = 'ArrowLeft'
          break;
        default:
          break;
      }
    });
  }
  render() {
    ctx.fillStyle = 'blue';
    this.segments.forEach(segment => {
      ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });
  }

  checkCollision(fruit) {
    return this.segments[0].x === fruit.position.x && this.segments[0].y === fruit.position.y;
  }
  
  checkWallCollision() {
    const head = this.segments[0];
    return (
      head.x < 1 || head.x >= map[0].length -1 || head.y < 1 || head.y >= map.length -1 || map[head.y][head.x] === 1
    );
  }
  checkSelfCollision() {
    const head = this.segments[0];
    for (let i = 1; i < this.segments.length; i++) {
      if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
        return true;
      }
    }
    return false;
  }
  increaseLength() {
    this.segments.push({ x: -1, y: -1 }); 
  }
  restart() {
    this.segments = [{ x: 5, y: 5 }];
    this.direction = 'right';
    this.length = 1;
  }
}

const player = new Player()
setInterval(()=>{player.move()}, player.getInterval())
player.changeMove()
player.render()
const game = new GameMap()
game.build()
const fruit = new Fruit()
fruit.generateFruit()

function gameLoop() {
  ctx.clearRect(0, 0, screen.width, screen.height);

  game.build();
  player.render();
  fruit.render()

  if (player.checkCollision(fruit)) {
    score.innerHTML=Number(score.innerHTML) + 1
    player.increaseLength();
    fruit.generateFruit();
  }
  if(player.checkSelfCollision() || player.checkWallCollision()){
    player.restart()
    fruit.generateFruit()
    score.innerHTML=Number(0)
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();