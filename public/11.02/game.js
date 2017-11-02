/* ------------- 游戏素材 ----------------*/

//背景
class Background extends Sprite {
    constructor(game, obj) {
        super(game, obj)
    }

    setup() {
        this.y = 0
    }

    update() {
        const g = this.game
        let img = 'img_bg_level_' + config.BgLevel + '.jpg'
        let bg = id[img]
        this.posX = bg.frame.x
        this.posY = bg.frame.y
    }
}

//云
class Cloud extends Sprite {
    constructor(game, obj) {
        super(game, obj)
        this.setup(game)
    }

    setup(g) {
        this.x = randomNum(-this.width, canvas.width + this.width)
        this.y = -this.height
    }

    update() {
        this.y += 1
        if (this.y > canvas.height) {
            this.setup()
        }
    }
}

class Hp {
    constructor(game, width, height, color) {
        this.game = game
        this.x = 30
        this.y = 30
        this.width = width
        this.height = height
        this.color = color || '#000'
        this.setup(game)
    }

    static new(...args) {
        return new this(...args)
    }

    setup(g) {
    }

    draw() {
        this.game.drawRect(this)
    }

    sub(num) {
        if (this.width <= 0) {
            this.width = 0
        } else {
            this.width -= num || 1
        }
    }

    setPosition(x, y) {
        this.x = x
        this.y = y
    }
}

//玩家
class Player extends Sprite {
    constructor(game, obj) {
        super(game, obj)
        this.setup && this.setup()
    }

    setup() {
        this.x = canvas.width / 2 - this.width / 2
        this.y = canvas.height - this.height - 30
        this.speedY = config.PlayerSpeed + 1
        this.speedX = config.PlayerSpeed
        this.attr = {
            hp: 100
        }
        this.cooling = 0
        this.direction = 'right'
    }

    update() {
        const g = this.game
        this.speedX = config.PlayerSpeed
        if (this.cooling > 0) {
            this.cooling--
        }
        this.hp1.setPosition(this.x + this.width / 2 - this.hp1.width / 2, this.y + this.height + 5)
        this.hp2.setPosition(this.x + this.width / 2 - this.hp1.width / 2, this.y + this.height + 5)
    }

    fire() {
        const g = this.game
        if (this.cooling === 0) {
            this.cooling = config.PlayerBulletCool
            let playerB = Bullet.new(g, id['img_bullet 1_12.PNG'])
            playerB.x = this.x + this.width / 2 - playerB.width / 2
            playerB.y = this.y - playerB.height / 3
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
                if (this.x >= canvas.width - this.width) {
                    this.x = canvas.width - this.width
                } else {
                    this.x += this.speedX
                }
                break
            case 'down':
                if (this.y >= canvas.height - this.height) {
                    this.y = canvas.height - this.height
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
        this.y -= this.speedY
    }
}

//敌人
class Monster extends Sprite {
    constructor(game, obj) {
        super(game, obj)
        this.setup()
    }

    setup() {
        this.speedY = randomNum(1, 3) * 0.6
        this.attr = {
            hp: 10
        }
        this.cooling = 0
    }

    update() {
        if (this.cooling > 0) {
            this.cooling--
        }
        this.y += this.speedY
        if (this.y >= canvas.height) {
            this.setup()
        }
    }

    subHp(num) {
        if (this.attr.hp <= 0) {
            this.attr.hp = 0
        } else {
            this.attr.hp -= num || 1
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
        this.x = canvas.width / 2 - 30
        this.y = canvas.height / 2 + 30
        this.r = 100
    }

    update() {
        this.x += this.speedX
        let self = this
        let isHit = contain(self, {
            x: canvas.width / 2 - self.r - self.width / 2,
            y: canvas.height / 2 - self.r - self.height / 2,
            width: self.r + self.width,
            height: self.r + self.height,
        })
        if (isHit === 'left' || isHit === 'right') {
            this.speedX *= -1
        }
    }
}

//开始场景
class SceneStart extends Scene {
    constructor(game) {
        super(game)
        this.setup(game)
    }

    setup(g) {
        let bg = Background.new(g, id['img_bg_level_2.jpg'])
        let r = Reborn.new(g, id['player12.png'])
        this.title = {
            txt: '按 1 开始',
            x: canvas.width / 2 - 50,
            y: 120,
            color: '#000',
        }
        r.x = canvas.width / 2 - r.width / 2
        r.y = canvas.height / 2 - r.height / 2
        r.speedX = 1
        this.addSprite(bg)
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
        this.setup(game)
        this.keyBind(game)
    }

    setup(g) {
        g.keyBoard.reset()
        let bg = Background.new(g, id['img_bg_level_1.jpg'])
        let cloud1 = Cloud.new(g, id['img_cloud_1.png'])
        let cloud2 = Cloud.new(g, id['img_cloud_2.png'])
        cloud1.y = cloud2.y - canvas.height

        this.player = Player.new(g, id['player12.png'])
        let p = this.player
        p.bullets = []

        p.hp1 = Hp.new(g, p.attr.hp, 8)
        p.hp2 = Hp.new(g, p.attr.hp, 8, '#EA4335')
        this.addSprite(bg)
        this.addSprite(cloud1)
        this.addSprite(cloud2)
        //
        this.addEnemies()
        this.addSprite(p)
        this.addSprite(p.hp1)
        this.addSprite(p.hp2)

    }

    init() {
    }

    addEnemies() {
        const g = this.game
        this.es = []
        let space = 50
        for (let i = 0; i < 16; i++) {
            let name = 'enemy' + randomNum(2, 17) + '.png'
            let enemy = Monster.new(g, id[name])
            enemy.x = randomNum(0, canvas.width - enemy.width) + space * i
            enemy.y = -(canvas.height / 2 + space) * i - enemy.height
            // this.addSprite(enemy)
            this.es.push(enemy)
        }
    }

    draw() {
        super.draw()
        this.player.bullets.forEach((b, i) => {
            b.draw()
        })
        this.es.forEach((e, i) => {
            e.draw()
        })
    }

    update() {
        if (window.pause) {
            return
        }
        super.update()
        this.player.bullets.forEach((b, i) => {
            b.update()
            if (b.y <= 0) {
                this.player.bullets.splice(i, 1)
            }
            this.es.forEach((e, j) => {
                if (isCollide(b, e)) {
                    this.player.bullets.splice(i, 1)
                    e.subHp()
                    // log('击中第' + j + '架飞机,血量为:' + e.attr.hp)
                }
                if (e.attr.hp <= 0) {
                    // log('第' + i + '架飞机被击落')
                    this.es.splice(j, 1)
                }
            })
        })

        this.es.forEach((e, j) => {
            e.update()
        })
    }

    keyBind(g) {
        g.registerAction('2', () => {
            this.player.hp2.sub()
        })
        g.registerAction('j', () => {
            this.player.fire()
        })
        g.registerAction('a', () => {
            this.player.move('left')
        })
        g.registerAction('w', () => {
            this.player.move('up')
        })
        g.registerAction('d', () => {
            this.player.move('right')
        })
        g.registerAction('s', () => {
            this.player.move('down')
        })
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
