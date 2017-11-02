/* ------------- 游戏素材 ----------------*/

//血条
class Hp {
    constructor(game, width, height, color) {
        this.game = game
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

    setup(w) {
        this.width = w
    }

    draw() {
        this.game.drawRect(this)
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

//背景陆地
class Background {
    constructor(game, x, y, width, height, color) {
        this.x = x
        this.y = y
        this.game = game
        this.width = width
        this.height = height
        this.color = color || '#000'
    }

    static new(...args) {
        let i = new this(...args)
        return i
    }

    draw() {
        this.game.drawRect(this)
    }
}

//玩家
class Player extends Sprite {
    constructor(game, obj) {
        super(game, obj)
        this.setup && this.setup()
    }

    setup() {
        this.x = 15
        this.y = canvas.height - this.height - config.BgHeight
        this.speedY = 0
        this.speedX = config.PlayerSpeed
        this.attr = {
            hp: 50
        }
        this.cooling = 0
        this.isDown = true
        this.direction = 'right'
    }

    update() {
        const g = this.game
        this.speedX = config.PlayerSpeed
        let player = this.direction === 'left' ? Player.new(g, id['wq_l.png']) : Player.new(g, id['wq.png'])
        let weapon = this.direction === 'left' ? Player.new(g, id['mp5_l.png']) : Player.new(g, id['mp5.png'])
        this.posX = player.posX
        this.posY = player.posY
        this.weapon.posX = weapon.posX
        this.weapon.posY = weapon.posY
        if (this.cooling > 0) {
            this.cooling--
        }
        if (this.y >= canvas.height - this.height - config.BgHeight) {
            this.speedY = 0
            this.isDown = true
        }
        if (this.y <= canvas.height - this.height - config.BgHeight - 15) {
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
        const g = this.game
        if (this.cooling === 0) {
            this.cooling = config.PlayerBulletCool
            let playerB = Bullet.new(g, id['bullet.png'])
            playerB.x = this.direction === 'right' ? this.x + this.width + 5 : this.x - 5
            playerB.y = this.weapon.y - 1
            playerB.direction = this.direction
            this.bullets.push(playerB)

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
                if (this.x >= canvas.width * 3 / 3 - this.width) {
                    this.x = canvas.width * 3 / 3 - this.width
                } else {
                    this.x += this.speedX
                }
                break
            case 'down':
                if (this.y >= canvas.height - this.height - 30) {
                    this.y = canvas.height - this.height - 30
                } else {
                    this.y += this.speedY
                }
                break
            case 'up':
                if (this.y <= 0) {
                    this.y = 0
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

//子弹
class Bullet extends Sprite {
    constructor(game, obj) {
        super(game, obj)
        this.setup()
    }

    setup() {
        this.speedX = 7
        this.speedY = 7
        this.cooling = 0
    }

    update() {
        this.speedX = config.PlayerBulletSpeed
        this.speedY = config.PlayerBulletSpeed
        if (this.direction === 'right') {
            this.x += this.speedX
        } else {
            this.x -= this.speedX
        }
    }
}

//武器
class Weapon extends Sprite {
    constructor(game, obj) {
        super(game, obj)
        this.setup()
    }

    setup() {
        this.bulletNum = 200
    }
}

//敌人
class Monster extends Sprite {
    constructor(game, obj) {
        super(game, obj)
        this.setup()
    }

    setup() {
        this.speedX = .7
        this.x = canvas.width - 200
        this.y = canvas.height - this.height - config.BgHeight
        this.attr = {
            hp: 100
        }
        this.cooling = 0
    }

    update() {
        let self = this
        if (this.cooling > 0) {
            this.cooling--
        }
        this.hp1.setPosition(this.x + this.width / 2 - this.hp1.width / 2, this.y - 40)
        this.hp2.setPosition(this.x + this.width / 2 - this.hp1.width / 2, this.y - 40)

        this.spread()
        this.x -= this.speedX
        let blobHitWall = contain(self, {
            x: 150,
            y: 0,
            width: 200,
            height: canvas.height,
        })
        if (blobHitWall === 'left' || blobHitWall === 'right') {
            this.speedX *= -1
        }
    }

    spread() {
        const g = this.game
        for (let i = 0; i < randomNum(20, 30); i++) {
            let bullet2 = Bullet.new(g, id['bullet2.png'])
            bullet2.x = this.x + this.width / 2 - bullet2.width / 2
            bullet2.y = this.y + this.height / 2 - bullet2.height / 2
            bullet2.speedX = randomNum(1, 3) * [1, -1][randomNum(0, 1)]
            bullet2.speedY = randomNum(1, 3) * [1, -1][randomNum(0, 1)]
            bullet2.update = () => {
                bullet2.x += bullet2.speedX
                bullet2.y += bullet2.speedY
            }
            if (this.cooling === 0) {
                this.cooling = 5
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

//
class Reborn extends Sprite {
    constructor(game, obj) {
        super(game, obj)
        this.setup()
    }

    setup() {

    }

    update() {
        this.x += this.speedX
        if (this.x >= canvas.width - this.width || this.x <= 0) {
            this.speedX *= -1
        }
    }
}

//开始场景
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
        let reborn = g.readImage('reborn')
        let r = Reborn.new(g, reborn)
        r.speedX = 1
        this.addSprite(r)
        g.registerAction('1', () => {
            let s = SceneMain.new(g)
            g.replaceScene(s)
        })
    }

    draw() {
        super.draw()
        const g = this.game
        g.drawText(this.title)
    }

    update() {
        super.update()
    }
}

//主场景
class SceneMain extends Scene {
    constructor(game) {
        super(game)
        this.setup()
    }

    setup() {
        const g = this.game
        g.keyBoard.reset()
        //bg
        this.bg = Background.new(g, 0, canvas.height - config.BgHeight, canvas.width, config.BgHeight)
        let bg = this.bg
        //玩家
        this.player = Player.new(g, id['wq.png'])
        this.player.bullets = []
        let p = this.player
        //玩家血条
        p.hp1 = Hp.new(g, p.attr.hp, 5)
        p.hp2 = Hp.new(g, p.attr.hp, 5, '#E13B3D')
        //武器
        p.weapon = Weapon.new(g, id['mp5.png'])

        //blob
        this.monster = Monster.new(g, id['yt.png'])
        this.monster.bullets = []
        let b = this.monster
        //blob血条
        b.hp1 = Hp.new(g, b.attr.hp, 10)
        b.hp2 = Hp.new(g, b.attr.hp, 10, '#E13B3D')

        this.addSprite(bg)
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

    init() {
        this.player.setup()
        this.monster.setup()
        this.player.hp1.width = this.player.hp2.width = this.player.attr.hp
        this.monster.hp1.width = this.monster.hp2.width = this.monster.attr.hp
    }

    draw() {
        super.draw()
        this.player.bullets.forEach((b, i) => {
            b.draw()
        })
        this.monster.bullets.forEach((b2, i) => {
            b2.draw()
        })

    }

    update() {
        if (window.pause) {
            return
        }
        super.update()
        let playerHitMonster = getDirrction(this.player, this.monster)
        this.player.bullets.forEach((b, i) => {
            b.update()
            if (b.x >= canvas.width - b.width) {
                this.player.bullets.splice(i, 1)
            }
            if (isCollide(b, this.monster)) {
                if (this.player.direction === 'left') {
                    this.monster.x -= 5
                } else {
                    this.monster.x += 5
                }
                this.monster.subHp()
                this.player.bullets.splice(i, 1)
            }
        })
        this.monster.bullets.forEach((b2, i) => {
            b2.update()
            if (b2.x <= 0 || b2.x >= canvas.width || b2.y <= 0 || b2.y >= canvas.height) {
                this.monster.bullets.splice(i, 1)
            }
            if (isCollide(b2, this.player)) {
                let num = this.player.direction === 'right' ? -5 : 5
                this.player.x += num
                this.player.subHp()
                this.monster.bullets.splice(i, 1)
            }
        })
        if (this.player.attr.hp <= 0) {
            this.init()
            return
        }
        if (this.monster.attr.hp <= 0) {
            this.init()
            return
        }
    }
}

//结束场景
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
