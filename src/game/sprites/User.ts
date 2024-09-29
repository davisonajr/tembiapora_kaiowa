import { Scene } from 'phaser';
import Pet from './Pet';
import { loremIpsum } from "lorem-ipsum";

export default class User extends Phaser.Physics.Arcade.Sprite {

    // public state: string;

    public scene: Scene;
    public uniqueId: string;
    private sprite: string;
    private user;
    private pet: Pet | null;
    public sprites: Array<string> = ['male', 'female'];
    public username: string;
    private usernameText: Phaser.GameObjects.Text;
    private usernameBackground: Phaser.GameObjects.Graphics;

    private fontSize: integer = 12;
    private speechBubble: Phaser.GameObjects.Graphics;
    private speechText: Phaser.GameObjects.Text;
    private padding: integer = 10;
    private bubbleWidth: integer = 200
    private movementTimer: Phaser.Time.TimerEvent | null = null;
    private readonly moveSpeed: number = 60;

    constructor(scene: Scene, username: string, sprite = 'male', x = 32, y = 48) {
        super(scene, x, y, sprite);

        this.scene = scene;
        this.sprite = this.randomSprite();

        this.uniqueId = `user_${Date.now()}`;
        this.username = username;

        this.user = this.scene.physics.add.sprite(x, y, this.sprite);

        this.user.setCollideWorldBounds(true);

        this.createAnimations();
        this.createUsernameDisplay();

        this.speechBubble = this.scene.add.graphics();
        this.speechText = this.scene.add.text(0, 0, '', { font: '16px Arial', color: '#000000' });

        this.scene.events.on('update', this.update, this);
    }

    update() {

        if (this.user.body.velocity.x !== 0 || this.user.body.velocity.y !== 0) {
            if (Math.abs(this.user.body.velocity.x) > Math.abs(this.user.body.velocity.y)) {
                if (this.user.body.velocity.x > 0) {
                    this.user.anims.play(this.uniqueId + '_right', true);
                } else {
                    this.user.anims.play(this.uniqueId + '_left', true);
                }
            } else {
                if (this.user.body.velocity.y > 0) {
                    this.user.anims.play(this.uniqueId + '_down', true);
                } else {
                    this.user.anims.play(this.uniqueId + '_up', true);
                }
            }
        } else {
            this.user.anims.stop();
        }

        // Atualize a posição do nome de usuário
        this.updateUsernamePosition();

        // Atualize o pet, se existir
        if (this.pet) {
            this.pet.update();
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

    createUsernameDisplay() {
        this.usernameBackground = this.scene.add.graphics();
        this.usernameBackground.fillStyle(0x000000, 0.5);
        this.usernameBackground.fillRoundedRect(
            this.user.x,
            this.user.y,
            this.backgroundWidth(),
            this.backgroundHeight(),
            10
        );

        this.usernameText = this.scene.add.text(this.user.x, this.user.y, this.username, {
            fontSize: `${this.fontSize}px`,
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
    }

    updateUsernamePosition() {

        this.usernameBackground.setPosition(
            this.user.x - this.backgroundWidth() + 2 * this.padding,
            this.user.y - this.backgroundHeight() + .5 * this.padding
        );

        this.usernameText.setPosition(this.user.x, this.user.y + 40);
    }

    bubbleX() {
        return this.user.x + this.padding;
    }
    bubbleY() {
        return this.user.y - this.y;
    }

    backgroundWidth() {
        return this.username.length * (Math.min(this.padding, this.fontSize) - 1);
    }
    backgroundHeight() {
        return this.fontSize + this.padding;
    }

    setPet(pet: Pet) {
        this.pet = pet;
    }

    randomSprite() {
        return this.sprites[Math.floor(Math.random() * this.sprites.length)]
    }

    // Função para gerar frase aleatória
    generateRandomPhrase(): string {
        return loremIpsum({
            units: "sentences",
            count: 1,
            sentenceLowerBound: 3,
            sentenceUpperBound: 7,
        });
    }

    // Função para mostrar o balão de fala
    showSpeechBubble(text: string) {
        this.createBubbleText(text);
        this.createBubbleBackground()
    }

    updateSpeechBubble() {
        const bubbleX = this.bubbleX();
        const bubbleY = this.bubbleY();

        this.speechText.setPosition(
            bubbleX,
            bubbleY - this.speechText.height
        );

        this.createBubbleBackground();
    }

    createBubbleText(text: string) {
        const bubbleX = this.bubbleX();
        const bubbleY = this.bubbleY();

        this.speechText.setText(text);
        this.speechText.setWordWrapWidth(this.bubbleWidth - 2 * this.padding);
        this.speechText.setPosition(bubbleX, bubbleY - this.speechText.height);
    }

    createBubbleBackground() {
        const bubbleX = this.bubbleX();
        const bubbleY = this.bubbleY();

        this.speechBubble.clear();
        this.speechBubble.lineStyle(2, 0x000000, 1);
        this.speechBubble.fillStyle(0xffffff, 1);
        this.speechBubble.fillRoundedRect(bubbleX - this.padding, bubbleY - this.speechText.height - this.padding, this.speechText.width + 2 * this.padding, this.speechText.height + 2 * this.padding, 10);
        this.speechBubble.strokeRoundedRect(bubbleX - this.padding, bubbleY - this.speechText.height - this.padding, this.speechText.width + 2 * this.padding, this.speechText.height + 2 * this.padding, 10);
    }

    addSpeech(phrase: string) {
        this.showSpeechBubble(phrase);

        const updateEvent = this.scene.time.addEvent({
            delay: 1,
            loop: true,
            callback: () => {
                this.updateSpeechBubble();
            }
        });

        this.scene.time.delayedCall(3000, () => {
            this.speechBubble.clear();
            this.speechText.setText('');
            updateEvent.remove();
        });

    }
    moveRandomly() {
        if (this.movementTimer) {
            this.movementTimer.remove();
        }

        const moveUser = () => {
            const randomDelay = Phaser.Math.Between(1500, 3000);
            const direction = Phaser.Math.Between(0, 4);
            const speed = this.moveSpeed;

            this.user.setVelocity(0);

            switch (direction) {
                case 0: // Cima
                    this.user.y - speed > 0
                        ? this.user.setVelocityY(-speed)
                        : this.user.setVelocityY(speed)

                    break;
                case 1: // Baixo
                    (this.user.y + speed) < this.scene.game.config.height
                        ? this.user.setVelocityY(speed)
                        : this.user.setVelocityY(-speed)
                        ;
                    break;
                case 2: // Esquerda
                    this.user.x - speed > 0
                        ? this.user.setVelocityX(-speed)
                        : this.user.setVelocityX(speed)
                        ;
                    break;
                case 3: // Direita
                    (this.user.x + speed) < this.scene.game.config.width
                        ? this.user.setVelocityX(speed)
                        : this.user.setVelocityX(-speed)
                        ;
                    break;
                default:
                    this.stopRandomMovement();
                    break;
            }

            this.movementTimer = this.scene.time.delayedCall(randomDelay, moveUser);
        };

        moveUser();
    }


    stopRandomMovement() {
        if (this.movementTimer) {
            this.movementTimer.remove();
            this.movementTimer = null;
        }
        this.user.setVelocity(0);
    }
}
