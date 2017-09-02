// defined board
class Board {
    constructor(x, y, game) {
        const image = game.imageByName('board')
        this.speed = 15
        this.x = x
        this.y = y
        this.image = image.image
        this.w = image.w
        this.h = image.h
    }

    move(x) {
        this.x = x <= 0 ? 0 : x >= 375 - this.image.width ? 375 - this.image.width : x
    }

    moveLeft() {
        this.move(this.x - this.speed)
    }

    moveRight() {
        this.move(this.x + this.speed)
    }

    init() {
        this.x = 100
        this.y = 450
    }

    collide(o) {
        // return rectIntersects(this, o) || rectIntersects(o, this)
        return isIntersect(this, o) || isIntersect(o, this)
    }
}