const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
window.pause = false

/* ---------------- 主要类 -----------------*/
class Game {
    constructor(width, height, style, obj) {
        document.body.appendChild(canvas)
        canvas.width = width
        canvas.height = height
        this.color = style || '#000'
        this.preload = obj.preload
        this.start = obj.start
        this.keyBoard = keyPush()
        this.fps = 60
        this.scene = null
        this.images = {}
        window.addEventListener('keydown', (e) => {
            this.keyBoard.keydowns[e.key] = true
        })
        window.addEventListener('keyup', (e) => {
            this.keyBoard.keydowns[e.key] = false
        })
        window.addEventListener('keyup', (e) => {
            if (e.key === ' ') {
                window.pause = !window.pause
            }
        })
        this.preload()
    }

    update() {
        this.scene.update()
    }

    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    draw() {
        this.scene.draw()
    }

    runLoop() {
        this.keyBind()
        this.update()
        this.clear()
        this.draw()
        setTimeout(() => {
            this.runLoop()
        }, 1000 / this.fps)
    }

    preloadImage(obj) {
        loadImage(obj)
            .then((obj) => {
                log('load over')
                this.images = obj
                for (let key in id) {
                    id[key]['image'] = obj.image
                }
                this.start()
            })
    }

    keyBind() {
        let actions = Object.keys(this.keyBoard.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            if (this.keyBoard.keydowns[key]) {
                if (window.pause) {
                    return
                }
                this.keyBoard.actions[key]()
            }
        }
    }

    registerAction(key, callback) {
        this.keyBoard.actions[key] = callback
    }

    drawImage(obj) {
        ctx.drawImage(obj.image, obj.posX, obj.posY, obj.width, obj.height, obj.x, obj.y, obj.width, obj.height)
    }

    drawText(obj) {
        ctx.fillStyle = obj.color || '#000'
        ctx.fillText(obj.txt, obj.x, obj.y)
    }

    drawRect(obj) {
        ctx.fillStyle = obj.color || this.color
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
    }

    replaceScene(s) {
        this.scene = s
    }

    runWithScene(s) {
        this.scene = s
        setTimeout(() => {
            this.runLoop()
        }, 1000 / this.fps)
    }

    readImage(name) {
        return {
            frame: {
                x: 0,
                y: 0,
                w: this.images[name].width,
                h: this.images[name].height
            },
            image: this.images[name]
        }
    }
}

class Sprite {
    constructor(game, obj) {
        this.game = game
        this.x = 0
        this.y = 0
        this.width = obj.frame.w
        this.height = obj.frame.h
        this.posX = obj.frame.x
        this.posY = obj.frame.y
        this.speedX = 0
        this.speedX = 0
        this.image = obj.image
    }

    static new(...args) {
        let i = new this(...args)
        return i
    }

    draw() {
        this.game.drawImage(this)
    }

    update() {
    }

    setSpeed(speedX, speedY) {
        this.speedX = speedX
        this.speedY = speedY
    }

    setPosition(x, y) {
        this.x = x
        this.y = y
    }
}

class Scene {
    constructor(game) {
        this.game = game
        this.sprites = []
    }

    static new(game, ...args) {
        let i = new this(game, ...args)
        return i
    }

    draw() {
        const g = this.game
        this.sprites.forEach((sprite) => {
            sprite.draw && sprite.draw(g)

        })
    }

    update() {
        if (window.pause) {
            return
        }
        const g = this.game
        this.sprites.forEach((sprite) => {
            sprite.update && sprite.update(g)
        })
    }

    addSprite(obj) {
        obj.scene = this
        this.sprites.push(obj)
    }

}