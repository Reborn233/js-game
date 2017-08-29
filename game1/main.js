const log = console.log.bind(console)
//collision test 1
function rectIntersects(a, b) {
    var o = a
    if (b.y > o.y && b.y < o.y + o.image.height) {
        if (b.x > o.x && b.x < o.x + o.image.width) {
            return true
        }
    }
    return false
}
//collision test 2
function isIntersect(a, b) {
    if (a.y > b.y + b.image.height || a.y + a.image.height < b.y || a.x + a.image.width < b.x || a.x > b.x + b.image.height) {
        return false
    }
    return true
}

function imageFromPath(path) {
    var img = new Image()
    img.src = path
    return img
}

function mulitDraw(num, image) {
    let res = [],
        x = 0,
        y = 0
    for (var i = 0; i < num; i++) {
        if (x > 300) {
            x = 0
            y += 48
        }
        let a = new Brick(x, y, image)
        res.push(a)
        x += 75
    }
    return res
}

// common class
class ele {
    constructor(x, y, image) {
        this.x = x
        this.y = y
        this.image = image
    }
}
// defined board
class Board extends ele {
    constructor(...args) {
        super(...args)
        this.speed = 15
    }

    moveLeft() {
        this.x -= this.speed
        if (this.x <= 0) {
            this.x = 0
        }
    }

    moveRight() {
        this.x += this.speed
        if (this.x >= 200) {
            this.x = 200
        }
    }
    init() {
        this.x = 100
        this.y = 450
    }

    collide(o) {
        // return rectIntersects(this, o) || rectIntersects(o, this)
        return isIntersect(this, o) || isIntersect(o, this)
    }
}
// defined ball
class Ball extends ele {
    constructor(...args) {
        super(...args)
        this.fired = false
        this.speedX = 6
        this.speedY = 6
    }

    move() {
        if (this.fired) {
            if (this.x <= 0 || this.x >= 375) {
                this.speedX = -this.speedX
            }
            if (this.y <= 0) {
                this.speedY = -this.speedY
            }

            this.x += this.speedX
            this.y += this.speedY
        }
    }
    setX(str) {
        if (this.fired) {
            return
        }
        this.x = str
    }
    fire() {
        this.fired = true
    }
    bounce() {
        this.speedY *= -1
    }
    init() {
        this.fired = false
        this.x = 175
        this.y = 425
    }
}
// defined brick
class Brick extends ele {
    constructor(...args) {
        super(...args)
        this.alive = true
    }

    kill() {
        this.alive = false
    }
    collide(o) {
        return this.alive && (isIntersect(this, o) || isIntersect(o, this))
    }
    init() {
        this.alive = true
    }
}
//defined game
class Rame {
    constructor() {
        const canvas = document.querySelector('#game')
        const ctx = canvas.getContext('2d')
        this.canvas = canvas
        this.ctx = ctx
        this.flag = false
        this.score = 0
        this.actions = {}
        this.keydowns = {}
        //events
        window.addEventListener('keydown', (e) => {
            this.keydowns[e.key] = true
        })
        window.addEventListener('keyup', (e) => {
            this.keydowns[e.key] = false
        })
        //timer
        this.timer = setInterval(() => {
            //events
            let actions = Object.keys(this.actions)
            for (let i = 0; i < actions.length; i++) {
                let key = actions[i]
                if (this.keydowns[key]) {
                    this.actions[key]()
                }
            }
            //updata
            this.update()
            //clear
            this.clear()
            //draw
            this.draw()
        }, 1000 / 60)
    }
    //register action
    registerAction(key, callback) {
        this.actions[key] = callback
    }
    drawImage(o) {
        this.ctx.drawImage(o.image, o.x, o.y)
    }
    drawText(txt, x, y, font) {
        this.ctx.font = font + 'px Microsoft YaHei'
        this.ctx.fillStyle = '#000'
        this.ctx.fillText(txt, x, y)
    }
    drawScreen() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    start() {
        this.flag = true
    }
    end(...args) {
        this.flag = false
        this.init()
        for (var i = 0; i < arguments.length; i++) {
            arguments[i].init()
        }
    }
    addScore() {
        this.score++
    }
    init() {
        let actions = Object.keys(this.actions)
        let key
        for (key in actions) {
            this.keydowns[actions[key]] = false
        }
        this.score = 0
    }
}
//game main
const _main = () => {
    let boardImage = imageFromPath('board.png')
    let ballImage = imageFromPath('ball.png')
    let brickImage = imageFromPath('brick.png')
    let board = new Board(100, 450, boardImage)
    let ball = new Ball(175, 425, ballImage)
    let brick = mulitDraw(5, brickImage)
    let game = new Rame()
    //left
    game.registerAction('a', () => {
        if (!game.flag) {
            return
        }
        board.moveLeft()
        ball.setX(board.x + (board.image.width - ball.image.width) / 2)
    })
    //right
    game.registerAction('s', () => {
        if (!game.flag) {
            return
        }
        board.moveRight()
        ball.setX(board.x + (board.image.width - ball.image.width) / 2)
    })
    //fire
    game.registerAction('j', () => {
        if (!game.flag) {
            return
        }
        ball.fire()
    })
    game.registerAction('Enter', () => {
        game.start()
    })
    game.update = () => {
        if (!game.flag) {
            return
        }
        ball.move()
        //collision
        if (board.collide(ball)) {
            ball.bounce()
        }
        for (var i = 0; i < brick.length; i++) {
            if (brick[i].collide(ball)) {
                game.addScore()
                brick[i].kill()
                // brick.splice(i, 1)
                ball.bounce()
            }
        }
        if (ball.y > 500) {
            alert('Your score : ' + game.score)
            game.end(board, ball)
            for (var i = 0; i < brick.length; i++) {
                brick[i].init()
            }
        }
        if (game.score == brick.length) {
            alert('Your score : ' + game.score)
            game.end(board, ball)
            for (var i = 0; i < brick.length; i++) {
                brick[i].init()
            }
        }
    }
    game.draw = () => {
        game.drawImage(board)
        game.drawImage(ball)
        if (!game.flag) {
            game.drawScreen()
            game.drawText('press Enter game', 10, 250, 42)
            game.drawText('A move left \n S move right \n J fire', 10, 294, 22)
        }
        for (var i = 0; i < brick.length; i++) {
            if (brick[i].alive) {
                game.drawImage(brick[i])
            }
        }
    }
}
_main()