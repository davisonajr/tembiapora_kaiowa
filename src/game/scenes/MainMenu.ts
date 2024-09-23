import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }
    preload ()
    {
        this.load.image('grass', 'assets/textures/grass.png');
        this.load.image('stone', 'assets/textures/stone.png');

    }
    create ()
    {
        this.add.tileSprite(0, 0, 1920, 1080, 'grass').setOrigin(0, 0);

        const brickWidth = 60; // Largura do bloco
        const startX = 10; // Ponto inicial no eixo X
        const yPosition = 1050; // Posição fixa no eixo Y
    
        // Lista de texturas para a parede
        const wallTextures = ['stone', 'stone', 'stone', 'stone', 'stone'];
    
        // Adiciona as texturas dinamicamente em linha
        wallTextures.forEach((texture, index) => {
            this.add.image(startX + brickWidth * index, yPosition, texture);
        });
    }
    
}
