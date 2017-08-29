// defined brick
class Brick {
    constructor(x, y) {
        const image = imageFromPath('images/brick.png')
        this.x = x
        this.y = y
        this.alive = true
        this.image = image
    }

    kill() {
        this.alive = false
    }
    collide(o) {
        return this.alive && (isIntersect(this, o) || isIntersect(o, this))
    }
    init() {
        this.alive = true
    }
}