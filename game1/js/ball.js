// defined ball
class Ball {
    constructor(x, y) {
        const image = imageFromPath('images/ball.png')
        this.fired = false
        this.x = x
        this.y = y
        this.speedX = 6
        this.speedY = 6
        this.image = image
    }

    move() {
        if (this.fired) {
            if (this.x <= 0 || this.x >= 375) {
                this.speedX = -this.speedX
            }
            if (this.y <= 0) {
                this.speedY = -this.speedY
            }

            this.x += this.speedX
            this.y += this.speedY
        }
    }
    setX(str) {
        if (this.fired) {
            return
        }
        this.x = str
    }
    fire() {
        this.fired = true
    }
    bounce() {
        this.speedY *= -1
    }
    init() {
        this.fired = false
        this.x = 175
        this.y = 425
    }
}