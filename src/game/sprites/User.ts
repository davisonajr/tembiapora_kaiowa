import { Scene } from 'phaser';
import Pet from './Pet';

export default class User extends Phaser.Physics.Arcade.Sprite{

    public scene: Scene;
    public uniqueId: string;
    private sprite: string;
    private user;
    private pet: Pet|null;
    public sprites: Array<string> = ['male', 'female'];

    constructor(scene: Scene, sprite = 'male', x = 32, y = 48) {
        super(scene, x, y, sprite);
        this.scene = scene;
        this.sprite = this.randomSprite();

        // Gerar um ID único
        this.uniqueId = `user_${Date.now()}`;

        // Carregar sprite aleatória (male ou female)

        // Adicionar o sprite com física
        this.user = this.scene.physics.add.sprite(x, y, this.sprite);

        // Definir colisão com as bordas do mundo
        this.user.setCollideWorldBounds(true);

        // Criar as animações
        this.createAnimations();
    }

    update() {
        const cursors = this.scene.input.keyboard.createCursorKeys();

        // Parar o jogador ao não pressionar nenhuma tecla
        this.user.setVelocity(0);

        if (cursors.left.isDown) {
            this.user.setVelocityX(-80);
            this.user.anims.play(this.uniqueId + '_left', true);
        } else if (cursors.right.isDown) {
            this.user.setVelocityX(80);
            this.user.anims.play(this.uniqueId + '_right', true);
        } else if (cursors.up.isDown) {
            this.user.setVelocityY(-80);
            this.user.anims.play(this.uniqueId + '_up', true);
        } else if (cursors.down.isDown) {
            this.user.setVelocityY(80);
            this.user.anims.play(this.uniqueId + '_down', true);
        } else {
            this.user.anims.stop();
        }
        if(this.pet)
        {
            this.pet.update(this.user.x,this.user.y);  
        }
    }

    createAnimations() {
        const anims = this.scene.anims;

        anims.create({
            key: this.uniqueId + '_down',
            frames: anims.generateFrameNumbers(this.sprite, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: this.uniqueId + '_left',
            frames: anims.generateFrameNumbers(this.sprite, { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: this.uniqueId + '_right',
            frames: anims.generateFrameNumbers(this.sprite, { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: this.uniqueId + '_up',
            frames: anims.generateFrameNumbers(this.sprite, { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
    }

    setPet(pet: Pet) {
        this.pet = pet;
    }

    randomSprite() {
        return this.sprites[Math.floor(Math.random() * this.sprites.length)]
    }
}
