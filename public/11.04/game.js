/* ------------- 游戏素材 ----------------*/

//
class Label {
    constructor(game, word) {
        this.txt = word
        this.x = 100
        this.y = 100
        this.color = '#000'
    }

    static new(...args) {
        return new this(...args)
    }

    draw(g) {
        g.drawText(this)
    }
}

//背景
class Background {
    constructor(game, width, height, color) {
        this.game = game
        this.x = 0
        this.y = canvas.height - height
        this.width = width
        this.height = height
        this.color = color || "#000"
    }

    static new(...args) {
        return new this(...args)
    }

    draw() {
        this.game.drawRect(this)
    }
}

//开始场景
class SceneStart extends Scene {
    constructor(game) {
        super(game)
        this.setup(game)
    }

    setup(g) {
        let bg = Background.new(g, canvas.width, 30)
        let title = Label.new(g, 'hello reborn')
        let p = SpriteAnimation.new(g)
        let s = Sprite.new(g,'idle1')
        this.p = p
        p.x = 10
        p.y = canvas.height - p.height - bg.height +10
        this.addSprite(bg)
        this.addSprite(title)
        this.addSprite(s)
        this.addSprite(p)

        this.keyBind(game)
    }

    keyBind(g){
        g.registerAction('a', (e) => {
            this.p.move(-5,e)
        })

        g.registerAction('d', (e) => {
            this.p.move(5,e)
        })
        g.registerAction('w',(e)=>{
            this.p.jump()
        })
    }

    draw() {
        super.draw()
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
