// const log = console.log.bind(console)

const el = (sel) => {
    return document.querySelector(sel)
}
const log = (s) => {
    el('#input-log').value += '\n' + s
}

//collision test 1
function rectIntersects(a, b) {
    var o = a
    if (b.y > o.y && b.y < o.y + o.image.height) {
        if (b.x > o.x && b.x < o.x + o.image.width) {
            return true
        }
    }
    return false
}

//collision test 2
function isIntersect(a, b) {
    if (a.y > b.y + b.image.height || a.y + a.image.height < b.y || a.x + a.image.width < b.x || a.x > b.x + b.image.height) {
        return false
    }
    return true
}

function imageFromPath(path) {
    var img = new Image()
    img.src = path
    return img
}


function mulitDraw(num, image) {
    let res = [],
        x = 0,
        y = 0
    for (var i = 0; i < num; i++) {
        if (x > 300) {
            x = 0
            y += 48
        }
        let a = new Brick(x, y, image)
        res.push(a)
        x += 75
    }
    return res
}
