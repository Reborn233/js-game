//defined game
class rgame {
    constructor(image) {
        const canvas = document.querySelector('#game')
        const ctx = canvas.getContext('2d')
        this.canvas = canvas
        this.ctx = ctx
        this.flag = false
        this.score = 0
        this.actions = {}
        this.keydowns = {}
        this.images = {}
        this.fps = 60
        //events
        window.addEventListener('keydown', (e) => {
            this.keydowns[e.key] = true
        })
        window.addEventListener('keyup', (e) => {
            this.keydowns[e.key] = false
        })
        let loads = []
        let names = Object.keys(image)
        //load all image
        for (let i = 0; i < names.length; i++) {
            let name = names[i]
            let path = image[name]
            let img = new Image()
            img.src = path
            this.images[name] = img
            img.onload = () => {

                loads.push(1)
                if (loads.length == names.length) {
                    this.run()
                }
            }
        }
    }

    imageByName(name){
        let img = this.images[name]
        return {
            w:img.width,
            h:img.height,
            image:img,
        }

    }
    run() {
        //timer
        setTimeout(() => {
            this.runloop()
        }, 1000 / this.fps)
    }

    runloop() {
        //events
        let actions = Object.keys(this.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            if (this.keydowns[key]) {
                this.actions[key]()
            }
        }
        //updata
        this.update()
        //clear
        this.clear()
        //draw
        this.draw()

        setTimeout(() => {
            this.runloop()
        }, 1000 / this.fps)
    }

    setFps(fps) {
        this.fps = fps
    }

    //register action
    registerAction(key, callback) {
        this.actions[key] = callback
    }

    drawImage(o) {
        this.ctx.drawImage(o.image, o.x, o.y)
    }

    drawText(txt, x, y, font) {
        this.ctx.font = font + 'px Microsoft YaHei'
        this.ctx.fillStyle = '#000'
        this.ctx.fillText(txt, x, y)
    }

    drawScreen() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    start() {
        this.flag = !this.flag
    }

    end(...args) {
        this.flag = false
        this.init()
        for (var i = 0; i < arguments.length; i++) {
            arguments[i].init()
        }
    }

    addScore() {
        this.score++
    }

    init() {
        let actions = Object.keys(this.actions)
        let key
        for (key in actions) {
            this.keydowns[actions[key]] = false
        }
    }
}