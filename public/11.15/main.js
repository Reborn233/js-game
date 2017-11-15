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
            this.keyBoard.keydowns[e.key] = 'down'
        })
        window.addEventListener('keyup', (e) => {
            this.keyBoard.keydowns[e.key] = 'up'
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
                }
                this.start()
            })
    }

    keyBind() {
        let actions = Object.keys(this.keyBoard.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            let status = this.keyBoard.keydowns[key]
            if (window.pause) {
                return
            }
            if (status === 'down') {
                this.keyBoard.actions[key](status)
            } else if (status === 'up') {
                this.keyBoard.actions[key](status)
                delete this.keyBoard.keydowns[key]
            }
        }
    }

    registerAction(key, callback) {
        this.keyBoard.actions[key] = callback
    }

    drawImage(obj) {
        ctx.drawImage(obj.texture, obj.x, obj.y)
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
        return this.images[name]
    }

    loadAnimation(length, animationName, arr) {
        for (let i = 1; i < length; i++) {
            let name = animationName + i
            let t = this.readImage(name)
            arr.push(t)
        }
    }
}

//静态精灵
class Sprite {
    constructor(game, name) {
        this.game = game
        this.x = 0
        this.y = 0
        this.texture = game.readImage(name)
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

//动画精灵
class SpriteAnimation {
    constructor(game) {
        this.game = game
        this.animations = {
            idle: [],
        }
        this.frameIndex = 0
        this.frameCount = 6
        //
        this.flipX = false
        this.flipY = false
        //
        this.vy = 0
    }

    static new(...args) {
        return new this(...args)
    }

    readFrame() {
        return this.animations[this.animationName]
    }

    changeAnimation(name) {
        this.animationName = name
    }

    draw() {
        ctx.save()
        let x = this.x + this.width / 2
        let y = this.y + this.height / 2
        if (this.flipX) {
            ctx.translate(x, 0)
            ctx.scale(-1, 1)
            ctx.translate(-x, 0)
        }
        this.game.drawImage(this)
        ctx.restore()
    }

    update() {
        this.frameCount--
        if (this.frameCount === 0) {
            this.frameCount = 6
            this.frameIndex = (this.frameIndex + 1) % this.readFrame().length
            this.texture = this.readFrame()[this.frameIndex]
        }
    }
}






