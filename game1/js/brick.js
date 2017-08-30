// defined brick
class Brick {
    constructor(p) {
        const image = imageFromPath('images/brick.png')
        this.x = p[0]
        this.y = p[1]
        this.alive = true
        this.image = image
        this.lifes = p[2] || 1
    }

    kill() {
        this.lifes --
        if(this.lifes < 1){
            this.alive = false
        }
    }
    collide(o) {
        return this.alive && (isIntersect(this, o) || isIntersect(o, this))
    }
    init() {
        this.alive = true
    }
}