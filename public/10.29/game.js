const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
window.pause = false

class Game {
    constructor(width, height, style, obj) {
        document.body.appendChild(canvas)
        canvas.width = width
        canvas.height = height
        ctx.fillStyle = style || '#000'
        this.preload = obj.preload
        this.start = obj.start
        this.keyBoard = keyPush()
        this.fps = 60
        this.scene = null
        this.images = {}
        this.pause = false
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
        ctx.fillStyle = obj.color || '#000'
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
}

class Sprite {
    constructor(obj) {
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
    }

    update() {
    }
}

class Scene {
    constructor(game) {
        this.game = game
    }

    static new(game, ...args) {
        let i = new this(game, ...args)
        return i
    }

    draw() {
    }

    update() {
    }
}

class Background extends Sprite {
    constructor(...args) {
        super(...args)
    }
}

class Hp {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color || '#000'
    }

    static new(...args) {
        let i = new this(...args)
        return i
    }

    add(num) {
        this.width += num
    }

    sub() {
        if (this.width <= 0) {
            this.width = 0
        } else {
            this.width -= 1
        }
    }

    setPosition(x, y) {
        this.x = x
        this.y = y
    }
}

class Player extends Sprite {
    constructor(...args) {
        super(...args)
    }

    move(direction) {
        if (window.pause) {
            return
        }
        switch (direction) {
            case 'left':
                if (this.x <= 32) {
                    this.x = 32
                } else {
                    this.x -= this.speedX
                }
                break
            case 'right':
                if (this.x >= canvas.width - this.width - 32) {
                    this.x = canvas.width - this.width - 32
                } else {
                    this.x += this.speedX
                }
                break
            case 'bottom':
                if (this.y >= canvas.height - this.height - 32) {
                    this.y = canvas.height - this.height - 32
                } else {
                    this.y += this.speedY
                }
                break
            case 'top':
                if (this.y <= 32) {
                    this.y = 32
                } else {
                    this.y -= this.speedY
                }
                break
        }
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

class Monster {
    constructor(game) {
        this.game = game
        this.blobs = []
    }

    draw() {
        const g = this.game
        this.blobs.forEach((blob, index) => {
            g.drawImage(blob)
        })
    }
}

class Bullet {
    constructor(game) {
        this.game = game
        this.bullets = []
    }

    draw() {
        const g = this.game
        this.bullets.forEach((bullet, index) => {
            bullet.x += bullet.speedX
            g.drawImage(bullet)
        })
    }
}

class SceneStart extends Scene {
    constructor(game) {
        super(game)
        this.text = {}
        this.create()
        game.registerAction('1', () => {
            scene2 = SceneMain.new(game)
            game.replaceScene(scene2)
        })
    }

    draw() {
        const g = this.game
        for (let key in this.text) {
            g.drawText(this.text[key])
        }
    }

    create() {
        let title = {
            name: 'title',
            txt: '按 1 开始',
            x: 120,
            y: 120
        }
        this.addText(title)
    }


    addText(obj) {
        this.text[obj.name] = obj
    }
}

class SceneMain extends Scene {
    constructor(game) {
        super(game)
        this.sprites = {}
        this.rects = {}
        this.list = {}
        this.create()

        this.keyPush()
        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'j':
                    this.sprites['bullet'].fire()
                    break
            }
        })
    }

    draw() {
        const g = this.game
        const s = this.sprites
        const r = this.rects
        const l = this.list
        r['phpout'].setPosition(s['wq'].x + s['wq'].width / 2 - r['phpout'].width / 2, s['wq'].y - 10)
        r['phpin'].setPosition(s['wq'].x + s['wq'].width / 2 - r['phpout'].width / 2, s['wq'].y - 10)
        s['mp5'].setPosition(s['wq'].x + s['wq'].width - 22, s['wq'].y + s['wq'].height - 14)
        Object.keys(this.sprites).forEach((key) => {
            g.drawImage(this.sprites[key])
        })
        Object.keys(this.rects).forEach((key) => {
            g.drawRect(this.rects[key])
        })
        s['bullet'].bullets.forEach((bullet, index) => {
            if (index > 10) {
                return
            }
            bullet.x += s['bullet'].speedX
            s['bullet'].x = bullet.x
            s['bullet'].y = bullet.y
            g.drawImage(s['bullet'])
            this.blobs.forEach((blob, j) => {
                log(blob)
                if (isCrash(bullet, blob)) {
                    log('击中')
                    s['bullet'].bullets.splice(index, 1)
                }
            })

            if (s['bullet'].x >= canvas.width - s['bullet'].width - 32) {
                s['bullet'].bullets.splice(index, 1)
            }
        })
        l['monster'].draw()
    }

    update() {
    }

    keyPush() {
        const g = this.game
        const s = this.sprites
        const r = this.rects
        g.registerAction('j', () => {
        })
        g.registerAction('a', () => {
            s['wq'].move('left')
        })
        g.registerAction('w', () => {
            s['wq'].move('top')
        })
        g.registerAction('d', () => {
            s['wq'].move('right')
        })
        g.registerAction('s', () => {
            s['wq'].move('bottom')
        })
    }

    create() {
        const g = this.game
        //背景
        let bg = Background.new(id['bg.png'])
        bg.name = 'bg'
        this.addSprite(bg)
        //血条
        let phpin = Hp.new(10, 10, 50, 5)
        phpin.name = 'phpin'
        let phpout = Hp.new(10, 10, 50, 5, 'red')
        phpout.name = 'phpout'
        this.addRect(phpin)
        this.addRect(phpout)
        //玩家
        let wq = Player.new(id['wq.png'])
        wq.name = 'wq'
        wq.setSpeed(5, 5)
        wq.setPosition(32, canvas.height / 2 - wq.height / 2)
        this.addSprite(wq)
        //武器
        let mp5 = Player.new(id['mp5.png'])
        mp5.name = 'mp5'
        mp5.rotate = 10
        this.addSprite(mp5)
        //子弹
        let bullets = new Bullet(g)
        let bullet = Player.new(id['bullet.png'])
        bullet.name = 'bullet'
        bullet.setSpeed(7, 7)
        bullet.setPosition(wq.x + wq.width + 10, wq.y + wq.height / 2 + 15)
        this.addList(bullets)
        //怪物
        let numOfBlobs = 6, //数量
            spacing = 48, //间隔
            xOffset = 150, //x坐标
            speed = .3, // 速度
            direction = 1 // 运动方向
        let monster = new Monster(g)
        monster.name = 'monster'
        for (let i = 0; i < numOfBlobs; i++) {
            let yt = Player.new(id['yt.png'])
            yt.name = 'yt' + i
            let x = spacing * i + xOffset
            let y = randomNum(32, canvas.height - yt.height - 32)
            yt.setSpeed(speed * direction, speed * direction)
            yt.setPosition(x, y)
            if (randomNum(0, 100) % 2 === 0) {
                direction *= 1
            } else {
                direction *= -1
            }
            monster.blobs.push(yt)
        }
        this.addList(monster)
    }

    addSprite(obj) {
        this.sprites[obj.name] = obj
    }

    addList(obj) {
        this.list[obj.name] = obj
    }

    addRect(obj) {
        this.rects[obj.name] = obj
    }
}
