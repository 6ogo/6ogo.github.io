// Projects/Phaser-Game/main.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;
let enemies;
let isDashing = false;
let dashCooldown = 0;
let dashDuration = 0;

function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('enemy', 'assets/sprites/enemy.png');
}

function create() {
    this.add.image(400, 300, 'background');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    
    enemies = this.physics.add.group();
    createEnemy(this, 600, 500);
    
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, enemies, hitPlayer, null, this);
}

function update() {
    if (isDashing) {
        dashDuration++;
        if (dashDuration > 10) {
            isDashing = false;
            dashCooldown = 30;
            player.setVelocityX(0);
        }
        return;
    }

    if (dashCooldown > 0) dashCooldown--;

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    if (cursors.space.isDown && dashCooldown === 0) {
        dash();
    }
}

function dash() {
    isDashing = true;
    dashDuration = 0;
    player.setVelocityX(player.flipX ? -500 : 500);
}

function createEnemy(scene, x, y) {
    let enemy = scene.physics.add.sprite(x, y, 'enemy');
    enemies.add(enemy);
    enemy.setBounce(0.2);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocityX(-100);
}

function hitPlayer(player, enemy) {
    if (!isDashing) {
        player.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            player.clearTint();
        });
    }
}