let type = "WebGL"

if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

PIXI.utils.sayHello(type)

const renderer = PIXI.autoDetectRenderer(512, 512)
const btn = document.createElement('a')
btn.innerText = '重新开始'
btn.className = 'btn'
document.body.appendChild(renderer.view)
document.body.appendChild(btn)
btn.onclick = function() {
    reset()
}
log('加载游戏资源')
PIXI.loader.add('image/treasureHunter.json').load(start)

stage = new PIXI.Container() //舞台
let gameScene //主场景
let gameOverScene //game over场景
gameScene = new PIXI.Container()
gameOverScene = new PIXI.Container()
gameOverScene.visible = true

let game = {}
let state = stop //游戏状态  play 或者 stop
let keyBoard = keyPush()

function start() {
    log('游戏资源加载完成')
    //添加场景
    stage.addChild(gameScene)
    stage.addChild(gameOverScene)

    // 获取所有加载的素材
    let id = PIXI.loader.resources["image/treasureHunter.json"].textures
    //添加背景
    addDungeon(id)
    // 添加门
    addDoor(id)
    // 添加探险家
    addExplorer(id)
    // 添加宝箱
    addTreasure(id)
    //添加怪物
    addBlobs(id)
    //添加血条
    addHealthBar()
    //添加game over
    gameOver()
    //按键监听
    keyBind()
    //60帧数渲染
    runLoop()
}
let timer
//60帧数渲染
function runLoop() {
    timer = requestAnimFrame(runLoop)
    // 渲染舞台
    state()
    renderer.render(stage)
}

function play() {
    //游戏处理逻辑
    gameOverScene.visible = false
    //怪物移动
    blobsMove()
    //控制人物移动
    keyBind()
    getTreasure()
    //监听是否过关
    if (isPassGame()) {
        gameOverScene.children[0].text = 'You Win !'
        gameOverScene.visible = true
        state = stop
        btn.style.display = 'block'
    }
}

function stop() {
    // 游戏结束处理逻辑
    gameOverScene.visible = true
}
//重置游戏
function reset() {
    state = play
    gameOverScene.visible = false
    btn.style.display = 'none'
    stage.removeChildren()
    gameScene.removeChildren()
    gameOverScene.removeChildren()
    cancelAnimFrame(timer)
    start()

}

function gameOver() {
    let txt = 'w,a,s,d控制方向\n空格 开始/暂停'
    let msg = new PIXI.Text(
        txt, {
            fontFamily: "64px Futura",
            fill: "white",
        }
    )
    msg.x = stage.width / 2 - msg.width / 2
    msg.y = stage.height / 2 - msg.height / 2
    gameOverScene.addChild(msg)
}

//怪物移动
function blobsMove() {
    game.blobs.forEach(function(blob, index) {
        blob.y += blob.vy
        blob.x += blob.vx

        let blobHitWall = contain(blob, {
            x: 32,
            y: 32,
            width: 480,
            height: 480
        })
        if (blobHitWall === 'top' || blobHitWall === 'bottom') {
            blob.vy *= -1
        } else if (blobHitWall === 'left' || blobHitWall === 'right') {
            blob.vx *= -1
        }
        let newBlobs = Object.assign([], game.blobs)
        newBlobs.splice(index, 1)
        newBlobs.forEach(function(item) {
            let blobHitBlob = isCrash(item, blob)
            if (blobHitBlob) {
                blob.vy *= -1
                blob.vx *= -1
            }
        })

        if (isCrash(game.explorer, blob, 0)) {
            explorerHit()
        }
    })
}

//人物碰到怪物
function explorerHit() {
    if (game.healthBar.outer.width !== 0) {
        game.healthBar.outer.width -= 1
    }
    let timer = null,
        d = 1,
        alpha = 1
    timer = setInterval(() => {
        game.explorer.alpha = alpha * d
        d *= -1
    }, 200)
    setTimeout(() => {
        clearInterval(timer)
    }, 1000)
}
//得到宝箱
function getTreasure() {
    if (isCrash(game.explorer, game.treasure, 0)) {
        game.treasure.x = game.explorer.x - 12
        game.treasure.y = game.explorer.y - 12
    }
}

//宝箱到达出口,游戏胜利
function isPassGame() {
    if (isCrash(game.treasure, game.door, 0)) {
        return true
    }
    return false
}

//按键绑定
function keyBind() {
    let explorer = game.explorer
    window.addEventListener('keydown', function(e) {
        keyBoard.keydowns[e.key] = true
    })

    window.addEventListener('keyup', function(e) {
        keyBoard.keydowns[e.key] = false
    })
    let actions = Object.keys(keyBoard.actions)
    for (let i = 0; i < actions.length; i++) {
        let key = actions[i]
        if (keyBoard.keydowns[key]) {
            keyBoard.actions[key]()
        }
    }
    window.addEventListener('keydown', function(e) {
        if (e.keyCode == 32) {
            if (state === play) {
                state = stop
            } else {
                state = play
            }
        }
    })
    keyBoard.registerAction('a', function() {
        if (state == stop) {
            return
        }
        if (explorer.x <= stage.x + 32) {
            explorer.x = stage.x + 32
        } else {
            explorer.x -= explorer.vx
        }
    })
    keyBoard.registerAction('w', function() {
        if (state == stop) {
            return
        }
        if (explorer.y <= stage.y + 32) {
            explorer.y = stage.y + 32
        } else {
            explorer.y -= explorer.vy
        }
    })
    keyBoard.registerAction('d', function() {
        if (state == stop) {
            return
        }
        if (explorer.x >= stage.width - explorer.width - 32) {
            explorer.x = stage.width - explorer.width - 32
        } else {
            explorer.x += explorer.vx
        }
    })
    keyBoard.registerAction('s', function() {
        if (state == stop) {
            return
        }
        if (explorer.y >= stage.height - explorer.height - 32) {
            explorer.y = stage.height - explorer.height - 32
        } else {
            explorer.y += explorer.vy
        }
    })
}

//添加素材
function addHealthBar() {
    let healthBar = new PIXI.Container()
    healthBar.position.set(stage.width - 170, 6)
    gameScene.addChild(healthBar)

    let innerBar = new PIXI.Graphics()
    innerBar.beginFill(0x000000)
    innerBar.drawRect(0, 0, 128, 8)
    innerBar.endFill()
    healthBar.addChild(innerBar)

    let outerBar = new PIXI.Graphics()
    outerBar.beginFill(0xDC143C)
    outerBar.drawRect(0, 0, 128, 8)
    outerBar.endFill()
    healthBar.addChild(outerBar)
    healthBar.outer = outerBar
    game['healthBar'] = healthBar
}

function addDungeon(id) {
    // 获取地牢素材并创建对应的 sprite
    let dungeon = new PIXI.Sprite(id["dungeon.png"])
    // 添加到场景中
    gameScene.addChild(dungeon)
    game['dungeon'] = dungeon
}

function addDoor(id) {
    let door = new PIXI.Sprite(id["door.png"])
    door.position.set(32, 0)
    gameScene.addChild(door)
    game['door'] = door
}

function addExplorer(id) {
    let explorer = new PIXI.Sprite(id["explorer.png"])
    explorer.x = 68;
    explorer.y = gameScene.height / 2 - explorer.height / 2
    explorer.vx = 5
    explorer.vy = 5
    gameScene.addChild(explorer)
    game['explorer'] = explorer
}

function addTreasure(id) {
    let treasure = new PIXI.Sprite(id["treasure.png"])
    treasure.x = gameScene.width - treasure.width - 48
    treasure.y = gameScene.height / 2 - treasure.height / 2
    gameScene.addChild(treasure)
    game['treasure'] = treasure
}

function addBlobs(id) {
    let numOfBlobs = 6, //数量
        spacing = 48, //间隔
        xOffset = 150, //x坐标
        speed = 1, // 速度
        direction = 1 // 运动方向

    let blobs = []

    for (let i = 0; i < numOfBlobs; i++) {
        let blob = new PIXI.Sprite(id['blob.png'])

        let x = spacing * i + xOffset

        let y = randomNum(32, stage.height - blob.height - 32)

        blob.x = x
        blob.y = y
        blob.vx = speed * direction
        blob.vy = speed * direction
        if (randomNum(0, 100) % 2 == 0) {
            direction *= 1
        } else {
            direction *= -1
        }
        blobs.push(blob)
        gameScene.addChild(blob)
    }
    game['blobs'] = blobs
}