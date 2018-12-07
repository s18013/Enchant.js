enchant();

const CHARA_IMAGE_NAME = "assets/images/chara1.png";
const ENEMY_IMAGE_NAME = "assets/images/monster/monster3.gif";
const BOMB_ICON = "assets/images/icon0.png";
const BOMB_EFFECT = "assets/images/effect0.png";
const TREASURE = "assets/images/map0.png"
const MAP_1 = "assets/images/map0.png";
const SPEED = 4;


let game;
let scene;
let enemy;
let bomb;

let Map1 = Class.create(Map, {
    initialize: function() {
        Map.call(this, 16, 16);
        this.image = game.assets[MAP_1]
        this.loadData(mapData);
        this.collisionData = mapHitData;
        scene.addChild(this);
    }
});

let Chara = Class.create(Sprite, {
    // 初期化
    initialize: function() {
        Sprite.call(this, 33, 33);
        this.input = game.input;
        this.image = game.assets[CHARA_IMAGE_NAME];
        this.frame = [0, 0, 1, 1, 2, 2];
        this.x = 16;
        this.y = 272;
        scene.addChild(this);
    },

    onenterframe: function() {

    }
});

let Enemy = Class.create(Sprite, {

    initialize: function(x, y, speed, direction, chara, bomb) {
        Sprite.call(this, 48, 46);
        this.image = game.assets[ENEMY_IMAGE_NAME];
        this.frame = [6, 6, 2, 2, 3, 3, 4, 4];
        this.direction = direction;
        this.scaleX *= this.direction;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.chara = chara;
        this.bomb = bomb;
    },

    create: function() {
        scene.addChild(this);
    },

    onenterframe: function() {
        this.moveBy(this.speed, 0);

        let pseudoSprite = this.width / 2;

        if (this.within(this.chara, pseudoSprite) == true) {
            this.chara.parentNode.removeChild(this.chara);
            alert('GAME OVER')
        }
        if (this.intersect(this.bomb) == true) {
            this.parentNode.removeChild(this);
        }

    }


        });

let Bomb = Class.create(Sprite, {
    initialize: function(x, y){
        Sprite.call(this, 16, 16);
        this.image = game.assets[BOMB_ICON];
        this.frame = [15];
        this.x = x;
        this.y = y;

    },

    create: function() {
        scene.addChild(this);
    },

    onenterframe: function() {
        if ((game.frame / game.fps) % 5 === 0) {
            this.image = game.assets[BOMB_EFFECT];
            this.frame = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
        }else if ((game.frame / game.fps) % 15 === 0) {
            this.parentNode.removeChild(this);
        }
    }
});

let  Tresure = Class.create(Sprite, {

    initialize: function(chara) {
        Sprite.call(this, 16, 16);
        this.image = game.assets[TREASURE];
        this.frame = [25];
        this.x = 24;
        this.y = 24;
        this.chara = chara;
        scene.addChild(this);
    },

    onenterframe: function() {

        if (this.intersect(this.chara) == true) {
            alert("GAME CLEAR")
        }
    }
});

let main = () => {
    game = new Game();
    scene = game.rootScene;

    game.preload(
    BOMB_ICON,
    BOMB_EFFECT,
    MAP_1,
    CHARA_IMAGE_NAME,
    ENEMY_IMAGE_NAME,
    TREASURE,
    );

        game.onload = () =>  {

            let map = new Map1();
            let chara = new Chara();
            let tresure = new Tresure(chara);

           scene.addEventListener(Event.TOUCH_START, function(e) {

                bomb = new Bomb(e.x, e.y);
                bomb.create();
            });

            scene.onenterframe = () => {

                if ((game.frame / game.fps) % 2 === 0) {
                    enemy = new Enemy(288, 214, -2, 1, chara, bomb);
                    enemy.create();
                }
                if ((game.frame / game.fps) % 3 === 0){
                    let enemy2 = new Enemy(288, 114, -2, 1, chara, bomb);
                    enemy2.create();
                }
                if ((game.frame / game.fps) % 3 === 0){
                    let enemy3 = new Enemy(0, 164, 1, -1, chara, bomb);
                    enemy3.create();
                }
                if ((game.frame / game.fps) % 7 === 0){
                    let enemy4 = new Enemy(0, 64, 4, -1, chara, bomb);
                    enemy4.create();
                }
                if ((game.frame / game.fps) % 9=== 0){
                    let enemy5 = new Enemy(288, 14, -1, 4, chara, bomb);
                    enemy5.create();
                }

                let pseudoX = chara.x + 8;//8は座標調整
                let pseudoY = chara.y;

                if (chara.input.left) {
                    pseudoX -= SPEED;
                //キャラのブロックすり抜けを防ぐため３つ用意
                    if (!map.hitTest(pseudoX, pseudoY) && !map.hitTest(pseudoX, pseudoY + 16) && !map.hitTest(pseudoX, pseudoY + 30))
                        chara.x -= SPEED;
                        chara.scaleX = -1;
                                        }

                if (chara.input.right) {
                    pseudoX += SPEED;
                    if (!map.hitTest(pseudoX +9, pseudoY) && !map.hitTest(pseudoX + 9, pseudoY + 16) && !map.hitTest(pseudoX +9, pseudoY +30))
                        chara.x += SPEED;
                        chara.scaleX = 1;
                }

                if (chara.input.up) {
                    pseudoY -= SPEED;
                    if (!map.hitTest(pseudoX, pseudoY))
                        chara.y -= SPEED;
                }
                if (chara.input.down) {
                    pseudoY += SPEED +28;//28は座標調整
                    if (!map.hitTest(pseudoX, pseudoY))
                        chara.y += SPEED;
                }
            }

        };

    game.start();
};
window.addEventListener('load', main);

let mapData = [
                    [ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
                    [ 6, 6, 6, 7, 6, 6, 7, 6, 6, 6, 7, 6, 6, 6, 6, 7, 6, 7, 6, 6],
                    [ 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
                    [ 6, 6, 7, 6, 6, 7, 6, 6, 7, 6, 6, 6, 7, 7, 6, 6, 6, 6, 6, 6],
                    [ 7, 7, 7, 7, 7, 7, 7, 7, 6, 7, 7, 7, 7, 7, 7, 7, 6, 6, 7, 7],
                    [ 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
                    [ 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
                    [ 7, 7, 6, 7, 7, 7, 6, 7, 7, 7, 7, 7, 7, 7, 7, 6, 7, 7, 7, 7],
                    [ 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6],
                    [ 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6],
                    [ 7, 7, 6, 7, 7, 7, 7, 7, 7, 7, 7, 6, 7, 7, 7, 7, 7, 6, 7, 7],
                    [ 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
                    [ 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
                    [ 7, 6, 7, 7, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 7],
                    [ 6, 6, 7, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6],
                    [ 6, 6, 7, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6],
                    [ 7, 6, 7, 7, 6, 7, 7, 7, 7, 7, 6, 7, 7, 7, 7, 7, 6, 7, 7, 7],
                    [ 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6],
                    [ 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6],
                    [ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
];

let mapHitData = [
                    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [ 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [ 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
                    [ 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
                    [ 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [ 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [ 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                    [ 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                    [ 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                    [ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
                    [ 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [ 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [ 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                    [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                    [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                    [ 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
                    [ 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                    [ 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
