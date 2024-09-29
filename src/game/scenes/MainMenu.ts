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
    
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('grass', 'assets/textures/grass.png');
        this.load.image('stone', 'assets/textures/stone.png');

        this.load.spritesheet('male', 'assets/spritesheets/male.png', {
            frameWidth: 32,  // Largura de cada quadro da sprite
            frameHeight: 48  // Altura de cada quadro da sprite
        });
        this.load.spritesheet('female', 'assets/spritesheets/female.png', {
            frameWidth: 32,  // Largura de cada quadro da sprite
            frameHeight: 48  // Altura de cada quadro da sprite
        });
        this.load.spritesheet('dog', 'assets/spritesheets/dog.png', {
            frameWidth: 32,  // Largura de cada quadro da sprite
            frameHeight: 32  // Altura de cada quadro da sprite
        });
        this.load.spritesheet('cat', 'assets/spritesheets/cat.png', {
            frameWidth: 32,  // Largura de cada quadro da sprite
            frameHeight: 32  // Altura de cada quadro da sprite
        });
    }
    create() {
        this.add.tileSprite(0, 0, 1920, 1080, 'grass').setOrigin(0, 0);

        // Criar o jogador
        this.user = new User(this);
        // Criar o cachorro
        this.pet = new Pet(this,this.user)

        this.user.setPet(this.pet);
    }
    
    update() {
        this.user.update();
    }
}
