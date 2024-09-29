import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    player: Phaser.Physics.Arcade.Sprite;
    dog: Phaser.Physics.Arcade.Sprite;
    constructor() {
        super('MainMenu');
    }
    preload() {
        this.load.image('grass', 'assets/textures/grass.png');
        this.load.image('stone', 'assets/textures/stone.png');
        this.load.spritesheet('hero', 'assets/spritesheets/male.png', {
            frameWidth: 32,  // Largura de cada quadro da sprite
            frameHeight: 48  // Altura de cada quadro da sprite
        });
        this.load.spritesheet('dog', 'assets/spritesheets/dog.png', {
            frameWidth: 32,  // Largura de cada quadro da sprite
            frameHeight: 32  // Altura de cada quadro da sprite
        });
    }
    create() {
        this.add.tileSprite(0, 0, 1920, 1080, 'grass').setOrigin(0, 0);

        // const brickWidth = 60; // Largura do bloco
        // const startX = 10; // Ponto inicial no eixo X
        // const yPosition = 1050; // Posição fixa no eixo Y

        // // Lista de texturas para a parede
        // const wallTextures = [10 * 'stone'];

        // // Adiciona as texturas dinamicamente em linha
        // wallTextures.forEach((texture, index) => {
        //     this.add.image(startX + brickWidth * index, yPosition, texture);
        // });

        // Criar o jogador
        this.player = this.physics.add.sprite(32, 48, 'hero');
        // Criar o cachorro
        this.dog = this.physics.add.sprite(32, 23, 'dog');

        // Configurar a colisão com os limites do cenário
        this.player.setCollideWorldBounds(true);
        this.dog.setCollideWorldBounds(true);

        // Criar animações para o personagem
        // Criar animações para o personagem e o cachorro
        this.createAnimations();
    }

    createAnimations() {
        // Animações do jogador
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        // Animações do cachorro
        this.anims.create({
            key: 'dog_left',
            frames: this.anims.generateFrameNumbers('dog', { start: 12, end: 14 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'dog_down',
            frames: this.anims.generateFrameNumbers('dog', { start: 8, end: 10 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'dog_right',
            frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'dog_up',
            frames: this.anims.generateFrameNumbers('dog', { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        const cursors = this.input.keyboard.createCursorKeys();

        // Parar o jogador ao não pressionar nenhuma tecla
        this.player.setVelocity(0);

        if (cursors.left.isDown) {
            this.player.setVelocityX(-80);
            this.player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(80);
            this.player.anims.play('right', true);
        } else if (cursors.up.isDown) {
            this.player.setVelocityY(-80);
            this.player.anims.play('up', true);
        } else if (cursors.down.isDown) {
            this.player.setVelocityY(80);
            this.player.anims.play('down', true);
        } else {
            this.player.anims.stop();
        }

        // Faz o cachorro seguir o jogador
        this.followPlayer();
    }

    followPlayer() {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.dog.x, this.dog.y);

        // Só faz o cachorro se mover se ele estiver a mais de 32 pixels de distância do jogador
        if (distance > 32) {
            const angle = Phaser.Math.Angle.Between(this.dog.x, this.dog.y, this.player.x, this.player.y);

            // Velocidade do cachorro
            const speed = 60;

            // Calcular a velocidade em X e Y usando trigonometria
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;

            this.dog.setVelocity(velocityX, velocityY);

            // Alterar as animações do cachorro com base no ângulo
            if (Math.abs(velocityX) > Math.abs(velocityY)) {
                if (velocityX > 0) {
                    this.dog.anims.play('dog_right', true);
                } else {
                    this.dog.anims.play('dog_left', true);
                }
            } else {
                if (velocityY > 0) {
                    this.dog.anims.play('dog_down', true);
                } else {
                    this.dog.anims.play('dog_up', true);
                }
            }
        } else {
            // Parar o cachorro quando ele está suficientemente perto
            this.dog.setVelocity(0);
            this.dog.anims.stop();
        }
    }
}
