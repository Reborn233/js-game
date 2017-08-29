//game main
var loadLevel = function(n) {
    n = n - 1
    let brick = []
    let level = levels[n]
    for (let i = 0; i < level.length; i++) {
        let p = level[i]
        let b = new Brick(p[0], p[1])
        brick.push(b)
    }
    return brick
}

const _main = () => {
    let level = 1
    let board = new Board(100, 450)
    let ball = new Ball(175, 425)
    let game = new Rgame(60)
    let brick = loadLevel(level)
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
        if (e.key == 'Enter') {
            game.start()
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
                game.addScore()
                brick[i].kill()
                ball.bounce()
            }
        }
        if (ball.y > 500) {
            alert('Your score : ' + game.score)
            game.end(board, ball)
            level = 1
            brick = loadLevel(level)
        }
        if (game.score == brick.length) {
            game.end(board, ball)
            level++
            if (level > levels.length) {
                alert('You Win')
                level = 1
            }
            alert('Your score : ' + game.score+'go on '+level)
            brick = loadLevel(level)
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