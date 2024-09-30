import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import User from '../sprites/User';
import Pet from '../sprites/Pet';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    user: User;
    pet: Pet;
    users: Array<User> = [];

    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('grass', 'assets/textures/grass.png');
        this.load.image('stone', 'assets/textures/stone.png');

        this.load.spritesheet('male', 'assets/spritesheets/male.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.spritesheet('female', 'assets/spritesheets/female.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.spritesheet('dog', 'assets/spritesheets/dog.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('cat', 'assets/spritesheets/cat.png', {
            frameWidth: 32,
            frameHeight: 32
        });

    }
    create() {
        this.add.tileSprite(0, 0, 1920, 1080, 'grass').setOrigin(0, 0);

        EventBus.on('message', (data) => {

            let username = data.user;
            let channel = data.channel;
            let message = data.message;

            let user = this.users.find((u) => { return u.username === username; });
            if (!user) {
                user = this.createUser(username);
            }

            user.addSpeech(message);
        });
    }

    createUser(username: string){

        let user = new User(this, username);
        this.pet = new Pet(this, user)

        user.setPet(this.pet);
        user.moveRandomly();

        if (this.users.length >= 20) {
            this.users.shift();
        }

        this.users.push(user);

        return user;
    }
}
