<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { MainMenu } from './game/scenes/MainMenu';
import PhaserGame from './game/PhaserGame.vue';
import authProvider from '@/auth/authProviderSetup';
import { ChatClient } from '@twurple/chat';

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();

// Event emitted from the PhaserGame component
const currentScene = (scene: MainMenu) => {

    canMoveSprite.value = (scene.scene.key !== "MainMenu");
}

onMounted(async () => {

    // Conectando ao chat da Twitch
    const chatClient = new ChatClient({
        authProvider,
        channels: ['tembiapora']
    });
    
    await chatClient.connect();

    // Adiciona listener para as mensagens do chat
    chatClient.onMessage((channel, user, message) => {
        console.log([channel, user, message]);
    });

});
</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
</template>
