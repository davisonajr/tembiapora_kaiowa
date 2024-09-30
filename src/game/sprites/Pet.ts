import { GameObjects, Scene } from 'phaser';
import User from './User';

export default class Pet extends Phaser.Physics.Arcade.Sprite {

    private owner;
    public uniqueId: string;
    public pet;
    public scene: Scene;
    private sprite;
    private sprites: Array<string> = ['dog','cat'];
    private speed: integer = 50;

    constructor(scene: Scene, user: User, x = 32, y = 48) {
        
        super(scene, x, y,'dog');
        this.sprite = this.randomSprite();

        this.scene = scene;
        this.owner = user;

        this.uniqueId = `pet_${user.uniqueId}`;

        this.pet = this.scene.physics.add.sprite(x, y, this.sprite);

        this.pet.setCollideWorldBounds(true);

        this.createAnimations();
    }

    createAnimations() {
        let anims = this.scene.anims;

        anims.create({
            key: this.uniqueId + '_right',
            frames: anims.generateFrameNumbers(this.sprite, { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: this.uniqueId + '_up',
            frames: anims.generateFrameNumbers(this.sprite, { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: this.uniqueId + '_down',
            frames: anims.generateFrameNumbers(this.sprite, { start: 8, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: this.uniqueId + '_left',
            frames: anims.generateFrameNumbers(this.sprite, { start: 12, end: 14 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        let distance = Phaser.Math.Distance.Between(this.owner.user.x, this.owner.user.y, this.pet.x, this.pet.y);

        if (distance > 32) {
            let angle = Phaser.Math.Angle.Between(this.pet.x, this.pet.y, this.owner.user.x, this.owner.user.y);

            let speed = this.speed;

            let velocityX = Math.cos(angle) * speed;
            let velocityY = Math.sin(angle) * speed;

            this.pet.setVelocity(velocityX, velocityY);

            if (Math.abs(velocityX) > Math.abs(velocityY)) {
                if (velocityX > 0) {
                    this.pet.anims.play(this.uniqueId + '_right', true);
                } else {
                    this.pet.anims.play(this.uniqueId + '_left', true);
                }
            } else {
                if (velocityY > 0) {
                    this.pet.anims.play(this.uniqueId + '_down', true);
                } else {
                    this.pet.anims.play(this.uniqueId + '_up', true);
                }
            }
        } else {
            this.pet.setVelocity(0);
            this.pet.anims.stop();
        }
    }

    randomSprite() {
        return this.sprites[Math.floor(Math.random() * this.sprites.length)]
    }
}
