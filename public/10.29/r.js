window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60)
        }
})()

window.cancelAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        function(timer) {
            window.clearTimeout(timer)
        }
})()

window.log = console.log.bind(console)

//随机色
const getRcolor = res => { Math.floor(Math.random() * (2 << 3)).toString(16) }

//简单碰撞检测
const isCollide = (sprite1, sprite2) => {
    if (sprite1.x + sprite1.width < sprite2.x ||
        sprite1.y + sprite1.height < sprite2.y ||
        sprite2.x + sprite2.width < sprite1.x ||
        sprite2.y + sprite2.height < sprite1.y) {
        return false
    }
    return true
}

//随机数
const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const typefor = (o) => {
    return Object.prototype.toString.call(o)
        .match(/(\w+)\]$/)[1]
        .toLowerCase()
}

const getJson = (res) =>{
    return res.frames
}

//读取资源
const loadImage = (obj) => {
    let res = {}
    let num = Object.keys(obj).length
    return new Promise((resolve, reject) => {
        for (let key in obj) {
            let img = new Image()
            img.src = obj[key]
            img.onload = () => {
                res[key] = img
                let resNum = Object.keys(res).length
                if (resNum === num) {
                    resolve(res)
                }
            }
        }
    })
}

//圆球碰撞
function isCrash(obj1, obj2, dis = 10) {
    let x = obj1.x - obj2.x;
    let y = obj1.y - obj2.y;
    let distance = Math.sqrt(x * x + y * y); //开方函数
    if (distance + dis < (obj1.width) / 2 + (obj2.width) / 2) { //判断碰撞
        return true
    }
    return false
}

function contain(sprite, container) {

    let collision = undefined;

    // 如果 sprite 的 x 坐标小于控制范围的 x 坐标，这个时候判定 sprite 已经运动到最左边，x坐标等于控制范围的 x 坐标，并输出这个时候的冲突方向为 left
    if (sprite.x < container.x) {
        sprite.x = container.x
        collision = "left"
    }

    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y
        collision = "top"
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width
        collision = "right"
    }

    // //Bottom
    // if (sprite.y + sprite.height > container.height) {
    //     sprite.y = container.height - sprite.height
    //     collision = "bottom"
    // }
    return collision
}

//绑定键位事件

function keyPush() {
    let u = {
        actions: {},
        keydowns: {},
        registerAction: function(key, callback) {
            this.actions[key] = callback
        },
        reset: function() {
            this.actions = {}
            this.keydowns = {}
        }
    }

    return u
}