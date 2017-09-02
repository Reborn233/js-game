//game main
const loadLevel = function (n, m) {
    n = n - 1
    let brick = []
    let level = levels[n]
    for (let i = 0; i < level.length; i++) {
        let p = level[i]
        let b = new Brick(p, m)
        brick.push(b)
    }
    return brick
}
const range = document.querySelector('#range')
const fps = document.querySelector('#fps')
const initText = function (x) {
    fps.innerHTML = x + ' fps'
}

const _main = () => {
    let level = 1
    const images = {
        ball: 'images/ball.png',
        board: 'images/board.png',
        brick: 'images/brick.png',
    }
    let game = new rgame(images, function (game) {
        let board = new Board(100, 450, game)
        let ball = new Ball(175, 425, game)
        let brick = loadLevel(level, game)
        range.value = game.fps
        initText(range.value)
        range.addEventListener('input', (e) => {
            let input = e.target
            let fps = Number(input.value) || 1
            game.setFps(fps)
            initText(fps)
        });
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
        window.addEventListener('keydown', (e) => {
            let k = e.key
            if (k == 'Enter') {
                game.start()
            } else if ('123456'.includes(k)) {
                level = Number(k)
                brick = loadLevel(level)
            }
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
                    brick[i].kill()
                    ball.bounce()
                    if (!brick[i].alive) {
                        game.addScore()
                    }
                }
            }
            if (ball.y > 500) {
                log('game over')
                game.end(board, ball)
                level = 1
                brick = loadLevel(level, game)
            }
            let isOver = brick.every((key) => {
                return key.alive == false
            })
            if (isOver) {
                log('进入下一关')
                game.end(board, ball)
                level++
                if(level>6){
                    log('恭喜你 通关了')
                    game.end(board, ball)
                    level = 1
                    brick = loadLevel(level, game)
                }else{
                    brick = loadLevel(level, game)
                }
            }
        }
        game.draw = () => {
            game.drawImage(board)
            game.drawImage(ball)
            game.drawText('得分: ' + game.score, 10, 450)
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
    })

}
_main()