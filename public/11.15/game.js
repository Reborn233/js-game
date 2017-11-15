/* ------------- 游戏素材 ----------------*/

//
class Label {
    constructor(game, word) {
        this.txt = word
        this.x = 100
        this.y = 100
        this.color = '#fff'
    }

    static new(...args) {
        return new this(...args)
    }

    draw(g) {
        g.drawText(this)
    }
}

//背景
class Background extends Sprite {
    constructor(game, name) {
        super(game, name)
        this.game = game
        this.texture = game.readImage(name)
    }

    static new(...args) {
        return new this(...args)
    }

    draw() {
        this.game.drawImage(this)
    }
}

//骑士
class Knight extends SpriteAnimation {
    constructor(game) {
        super(game)
        this.game = game
        this.animations = {
            idle: [],
            run:[],
        }
        game.loadAnimation(4, 'idle', this.animations['idle'])
        game.loadAnimation(4, 'run', this.animations['run'])
        this.animationName = 'idle'
        this.texture = this.readFrame()[0]
        this.width = this.texture.width
        this.height = this.texture.height
        this.speedY = config.PlayerSpeed
        this.speedX = config.PlayerSpeed
        this.equip = []
        this.bullets = []
        this.cooling = 0
    }

    fire(x, staX, y, staY) {
        if (this.cooling === 0) {
            this.cooling = config.PlayerBulletCool
            let b = Bullet.new(this.game)
            b.x = this.flipX ? this.x : this.x + this.width
            b.y = this.y + this.height / 3
            b.speedX = (x - staX) / b.speedX
            b.speedY = (y - staY) / b.speedY
            this.bullets.push(b)
        }
    }

    move(direction, keyStatus) {
        let animationStatus = {
            down: 'run',
            up: 'idle',
        }
        this.changeAnimation(animationStatus[keyStatus])
        switch (direction) {
            case 'up':
                this.y = this.y <= config.wall ? config.wall : this.y - this.speedY
                break
            case 'down':
                let h = canvas.height - this.height - config.wall
                this.y = this.y >= h ? h : this.y + this.speedY
                break
            case 'left':
                // this.flipX = true
                this.x = this.x <= config.wall ? config.wall : this.x - this.speedX
                break
            case 'right':
                // this.flipX = false
                let w = canvas.width - this.width - config.wall
                this.x = this.x >= w ? w : this.x + this.speedX
                break
        }
    }

    addEquip(obj) {
        this.equip.push(obj)
    }

    update() {
        super.update()
        this.speedX = this.speedX = config.PlayerSpeed
        if (this.cooling > 0) {
            this.cooling--
        }
    }
}

//武器
class Gun extends SpriteAnimation {
    constructor(game) {
        super(game)
        this.game = game
        this.animations = {
            gun: [],
        }
        game.loadAnimation(2, 'gun', this.animations['gun'])
        this.animationName = 'gun'
        this.texture = this.readFrame()[0]
        this.width = this.texture.width
        this.height = this.texture.height
        this.angle = 0
        this.flipY = true
    }

    draw() {
        ctx.save()
        let x = this.x
        let y = this.y + this.height / 2 + 5
        if (this.flipX) {
            ctx.translate(x, 0)
            ctx.scale(-1, 1)
            ctx.translate(-x, 0)
        }
        if (this.flipY) {
            ctx.translate(x, y)
            let angle = this.flipX ? this.angle * -1 : this.angle
            ctx.rotate(angle * Math.PI / 180)
            ctx.translate(-x, -y)
        }
        this.game.drawImage(this)
        ctx.restore()
    }
}

//子弹
class Bullet extends SpriteAnimation {
    constructor(game) {
        super(game)
        this.game = game
        this.animations = {
            bullet: [],
        }
        game.loadAnimation(2, 'bullet', this.animations['bullet'])
        this.animationName = 'bullet'
        this.texture = this.readFrame()[0]
        this.width = this.texture.width
        this.height = this.texture.height
        this.speedX = config.PlayerBulletSpeed
        this.speedY = config.PlayerBulletSpeed
        this.k = 1
    }

    update() {
        this.x += this.speedX
        this.y += this.speedY
    }

}

//轨迹
class Line {
    constructor(game) {
        this.data = {
            staX: 0,
            staY: 0,
            endX: 0,
            endY: 0,
        }
    }

    static new(...args) {
        return new this(...args)
    }

    setData(obj) {
        for (let key in obj) {
            this.data[key] = obj[key]
        }
    }

    draw() {
        ctx.beginPath()
        ctx.moveTo(this.data.staX, this.data.staY)
        ctx.lineTo(this.data.endX, this.data.endY)
        ctx.stroke()
    }
}

//开始场景
class SceneStart extends Scene {
    constructor(game) {
        super(game)
        this.setup(game)
    }

    setup(g) {
        let bg = Background.new(g, 'bg')
        let title = Label.new(g, 'hello reborn')
        let p = Knight.new(g)
        let gun = Gun.new(g)
        this.p = p
        this.gun = gun
        p.addEquip(gun)
        p.x = 50
        p.y = 50

        // let line = Line.new(g)
        // this.line = line
        this.addSprite(bg)
        this.addSprite(title)
        this.addSprite(p)
        this.addSprite(gun)
        // this.addSprite(line)
        this.keyBind(game)
    }

    keyBind(g) {
        g.registerAction('a', (e) => {
            this.p.move('left', e)
        })
        g.registerAction('d', (e) => {
            this.p.move('right', e)
        })
        g.registerAction('w', (e) => {
            this.p.move('up', e)
        })
        g.registerAction('s', (e) => {
            this.p.move('down', e)
        })
        g.registerAction('q', (e) => {
            this.p.flipY = true
        })
        canvas.addEventListener('mousemove', (e) => {
            let x = e.clientX, y = e.clientY - 50
            let angle = getAngle({x: x, y: y}, {
                x: this.gun.x + this.gun.width / 2,
                y: this.gun.y + this.gun.height / 2
            })
            this.gun.angle = angle
            this.p.flipX = this.gun.flipX = (x <= this.gun.x + this.gun.width / 2)
        })
        canvas.addEventListener('mousedown', (e) => {
            if (e.which === 1) {
                let x = e.clientX, y = e.clientY - 50
                let angle = getAngle({x: x, y: y}, {
                    x: this.gun.x + this.gun.width / 2,
                    y: this.gun.y + this.gun.height / 2
                })
                let x1 = this.gun.x + this.gun.width,
                    y1 = this.gun.y + this.gun.height / 2,
                    rx0 = this.gun.x,
                    ry0 = this.gun.y + this.gun.height / 2 + 5,
                    a = angle * Math.PI / 180,
                    staX = (x1 - rx0) * Math.cos(a) - (y1 - ry0) * Math.sin(a) + rx0,
                    staY = (x1 - rx0) * Math.sin(a) + (y1 - ry0) * Math.cos(a) + ry0
                // this.line.setData({
                //     staX: staX,
                //     staY: staY,
                //     endX: x,
                //     endY: y,
                // })
                let k = (y - staY) / (x - staX)
                this.p.fire(x, staX, y, staY)
            }
        })
    }

    follow() {
        this.gun.x = this.p.x + this.p.width / 2
        this.gun.y = this.p.y + this.p.height / 2 - this.gun.height / 4
    }

    draw() {
        super.draw()
        this.p.bullets.forEach((b, i) => {
            b.draw()
        })
    }

    update() {
        super.update()
        this.follow()
        this.p.bullets.forEach((b, i) => {
            b.update()
        })
    }
}

//主场景
class SceneMain extends Scene {
    constructor(game) {
        super(game)
        this.setup(game)
        this.keyBind(game)
        this.title = {
            txt: '场景2',
            x: canvas.width / 2 - 50,
            y: 120,
            color: '#000',
        }
    }

    setup(g) {
        g.keyBoard.reset()
    }

    draw() {
        super.draw()
        const g = this.game
        g.drawText(this.title)
    }

    update() {
        if (window.pause) {
            return
        }
        super.update()
    }

    keyBind(g) {
        g.registerAction('2', () => {
            log(2)
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
