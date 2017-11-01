const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
window.pause = false

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
        let bg = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
        }
        g.drawRect(bg)
        this.sprites.forEach((sprite) => {
            if (sprite.image) {
                g.drawImage(sprite)
            } else {
                g.drawRect(sprite)
            }
        })
    }

    update() {
        const g = this.game
        this.sprites.forEach((sprite) => {
            sprite.update && sprite.update(this.game)
        })
    }

    addSprite(obj) {
        obj.scene = this
        this.sprites.push(obj)
    }

}

class Hp {
    constructor(width, height, color) {
        this.x = 0
        this.y = 0
        this.width = width
        this.height = height
        this.color = color || '#000'
    }

    static new(...args) {
        let i = new this(...args)
        return i
    }

    update(g) {
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
        this.setup && this.setup()
    }

    setup() {
        this.x = 15
        this.y = canvas.height - this.height
        this.speedY = 0
        this.speedX = 2
        this.attr = {
            hp: 50
        }
        this.equip = null
        this.cooling = 0
        this.isDown = true
        this.direction = 'right'
    }

    update() {
        let wq = this.direction === 'left' ? Player.new(id['wq_l.png']) : Player.new(id['wq.png'])
        let weapon = this.direction === 'left' ? Player.new(id['mp5_l.png']) : Player.new(id['mp5.png'])
        this.posX = wq.posX
        this.posY = wq.posY
        this.weapon.posX = weapon.posX
        this.weapon.posY = weapon.posY
        if (this.cooling > 0) {
            this.cooling--
        }
        if (this.y >= canvas.height - this.height) {
            this.speedY = 0
            this.isDown = true
        }
        if (this.y <= canvas.height - this.height - 15) {
            this.speedY += 1
        }
        this.y += this.speedY
        this.hp1.setPosition(this.x + this.width / 2 - this.hp1.width / 2, this.y - 10)
        this.hp2.setPosition(this.x + this.width / 2 - this.hp1.width / 2, this.y - 10)
        if (this.direction === 'left') {
            this.weapon.setPosition(this.x - this.weapon.width / 3, this.y + 35)
        } else {
            this.weapon.setPosition(this.x + this.width - this.weapon.width * 2 / 3, this.y + 35)
        }
    }

    fire() {
        if (this.cooling === 0) {
            this.cooling = 9
            let bullet = Bullet.new(id['bullet.png'])
            bullet.direction = this.direction
            bullet.x = this.direction === 'right' ? this.weapon.x + this.weapon.width : this.weapon.x
            bullet.y = this.weapon.y - 1
            this.scene.sprites.bullets.push(bullet)
        }
    }

    move(direction) {
        this.direction = direction
        switch (direction) {
            case 'left':
                if (this.x <= 0) {
                    this.x = 0
                } else {
                    this.x -= this.speedX
                }
                break
            case 'right':
                if (this.x >= canvas.width * 2 / 3 - this.width) {
                    this.x = canvas.width * 2 / 3 - this.width
                } else {
                    this.x += this.speedX
                }
                break
            case 'down':
                if (this.y >= canvas.height - this.height - 32) {
                    this.y = canvas.height - this.height - 32
                } else {
                    this.y += this.speedY
                }
                break
            case 'up':
                if (this.y <= 32) {
                    this.y = 32
                } else {
                    this.y -= this.speedY
                }
                break
        }
    }

    jump() {
        this.isDown = false
        this.speedY = -15
        this.y += this.speedY
    }

    subHp() {
        if (this.attr.hp <= 0) {
            this.attr.hp = 0
        } else {
            this.attr.hp -= 1
            this.hp2.sub()
        }
    }

    addAttr(obj, name) {
        this.attr[name] = obj
    }
}

class Bullet extends Sprite {
    constructor(...args) {
        super(...args)
        this.setup()
    }

    setup() {
        this.speedX = 7
        this.speedY = 7
        this.cooling = 0
    }

    update() {
        if (this.direction === 'right') {
            this.x += this.speedX
        } else {
            this.x -= this.speedX
        }
    }
}

class Weapon extends Sprite {
    constructor(...args) {
        super(...args)
        this.setup()
    }

    setup() {
        this.bulletNum = 200
    }
}

class Monster extends Sprite {
    constructor(...args) {
        super(...args)
        this.setup()
    }

    setup() {
        this.speedX = .3
        this.x = canvas.width - 200
        this.y = canvas.height - this.height
        this.attr = {
            hp: 150
        }
        this.bullets = []
        this.cooling = 0
    }

    update() {
        if (this.cooling > 0) {
            this.cooling--
        }
        this.hp1.setPosition(this.x + this.width / 2 - this.hp1.width / 2, this.y - 40)
        this.hp2.setPosition(this.x + this.width / 2 - this.hp1.width / 2, this.y - 40)
        // this.x -= this.speedX
        // if (this.x <= 0 - this.width) {
        //     this.setup()
        // }
        this.spread()

    }

    spread() {
        for (let i = 0; i < randomNum(30, 50); i++) {
            let bullet2 = Bullet.new(id['bullet2.png'])
            bullet2.x = this.x + this.width / 2 - bullet2.width / 2
            bullet2.y = this.y + this.height / 2 - bullet2.height / 2
            bullet2.speedX = randomNum(-5, 5)
            bullet2.speedY = randomNum(-5, 5)
            bullet2.update = () => {
                bullet2.x += bullet2.speedX
                bullet2.y += bullet2.speedY
            }
            if (this.cooling === 0) {
                this.cooling = 4
                this.bullets.push(bullet2)
            }
        }
    }

    subHp() {
        if (this.attr.hp <= 0) {
            this.attr.hp = 0
        } else {
            this.attr.hp -= 1
            this.hp2.sub()
        }
    }
}

class SceneStart extends Scene {
    constructor(game) {
        super(game)
        this.title = {
            txt: '按 1 开始',
            x: 120,
            y: 120,
            color: '#000',
        }
        this.setup(game)
    }

    setup(g) {
        g.registerAction('1', () => {
            let s = SceneMain.new(g)
            g.replaceScene(s)
        })
    }

    draw() {
        const g = this.game
        g.drawText(this.title)
    }

    update() {
    }
}

class SceneMain extends Scene {
    constructor(game) {
        super(game)
        this.setup()
    }

    setup() {
        const g = this.game
        this.sprites.bullets = []
        //玩家
        this.wq = Player.new(id['wq.png'])
        let p = this.wq
        //玩家血条
        p.hp1 = Hp.new(p.attr.hp, 5)
        p.hp2 = Hp.new(p.attr.hp, 5, '#E13B3D')
        //武器
        p.weapon = Weapon.new(id['mp5.png'])

        //blob
        this.yt = Monster.new(id['yt.png'])
        let b = this.yt
        //blob血条
        b.hp1 = Hp.new(b.attr.hp, 10)
        b.hp2 = Hp.new(b.attr.hp, 10, '#E13B3D')

        this.addSprite(b)
        this.addSprite(b.hp1)
        this.addSprite(b.hp2)
        this.addSprite(p)
        this.addSprite(p.hp1)
        this.addSprite(p.hp2)
        this.addSprite(p.weapon)


        g.registerAction('j', () => {
            p.fire()
        })
        g.registerAction('a', () => {
            p.move('left')
        })
        g.registerAction('w', () => {
            if (p.isDown) {
                p.jump()
            }
        })
        g.registerAction('d', () => {
            p.move('right')
        })
    }

    draw() {
        super.draw()
        let bullet = this.sprites.bullets
        bullet.forEach((b, i) => {
            this.game.drawImage(b)
        })
        this.yt.bullets.forEach((b2, i) => {
            this.game.drawImage(b2)
        })

    }

    update() {
        super.update()
        if(this.wq.attr.hp<=0){
            alert('你死了')
            let s = SceneEnd.new(this.game)
            this.game.replaceScene(s)
            return
        }
        if(this.yt.attr.hp<=0){
            alert('你赢了')
            let s = SceneEnd.new(this.game)
            this.game.replaceScene(s)
            return
        }
        this.sprites.bullets.forEach((b, i) => {
            b.update()
            if (b.x >= canvas.width - b.width) {
                this.sprites.bullets.splice(i, 1)
            }
            if (isCollide(b, this.yt)) {
                this.yt.x += 5
                this.yt.subHp()
                this.sprites.bullets.splice(i, 1)
            }
        })
        this.yt.bullets.forEach((b2, i) => {
            b2.update()
            if (b2.x <= 0 || b2.x >= canvas.width || b2.y <= 0 || b2.y >= canvas.height) {
                this.yt.bullets.splice(i,1)
            }
            if(isCollide(b2,this.wq)){
                this.wq.subHp()
            }
        })
    }
}

class SceneEnd extends Scene {
    constructor(game) {
        super(game)
        this.title = {
            txt: '游戏结束 按 2 重来',
            x: 120,
            y: 120,
            color: '#000',
        }
        this.setup(game)
    }

    setup(g) {
        g.registerAction('2', () => {
            let s = SceneStart.new(g)
            g.replaceScene(s)
        })
    }

    draw() {
        const g = this.game
        g.drawText(this.title)
    }

    update() {
    }
}
