const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

class Game {
    constructor(width, height, obj) {
        document.body.appendChild(canvas)
        canvas.width = width
        canvas.height = height
        ctx.fillStyle = '#000'
        this.preload = obj.preload
        this.create = obj.create
        this.update = obj.update
        this.keyBoard = keyPush()
        this.sprites = {}
        this.fps = 60
        window.addEventListener('keydown', (e) => {
            this.keyBoard.keydowns[e.key] = true
        })
        window.addEventListener('keyup', (e) => {
            this.keyBoard.keydowns[e.key] = false
        })
    }

    run() {
        setTimeout(() => {
            this.runLoop()
        }, 1000 / this.fps)
    }

    runLoop() {
        this.keyBind()
        this.clear()
        this.draw()
        this.update()
        setTimeout(() => {
            this.runLoop()
        }, 1000 / this.fps)
    }

    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    draw() {
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    preloadImage(obj) {
        loadImage(obj)
            .then((res) => {
                log('load over')
                this.create(res)
                this.run()
            })
    }

    keyBind() {
        let actions = Object.keys(this.keyBoard.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            if (this.keyBoard.keydowns[key]) {
                this.keyBoard.actions[key]()
            }
        }
    }

    registerAction(key, callback) {
        this.keyBoard.actions[key] = callback
    }

    addSprite(obj) {
        let sprite = new Sprite(obj)
        this.sprites[obj.name] = sprite
    }



}

class Sprite {
    constructor(obj) {
        this.x = obj.x
        this.y = obj.y
        this.width = obj.width
        this.height = obj.height
        this.speedX = obj.speedX || 2
        this.speedY = obj.speedY || 2
        this.image = obj.image
        this.num = 0
        this.direction = 'right'
        this.isMove = false
    }

    add() {
        if (typefor(this.image) === 'object') {
            ctx.drawImage(this.image[this.direction][this.num], this.x, this.y)
        } else {
            ctx.drawImage(this.image, this.x, this.y)
        }
    }

    change() {
        setInterval(() => {
            if (!this.isMove) {
                this.num = 0
                return
            }
            if (this.num > 2) {
                this.num = 0
            } else {
                this.num += 1
            }
        }, 150)
    }
}