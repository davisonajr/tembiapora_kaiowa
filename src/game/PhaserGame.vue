<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { EventBus } from './EventBus';
import StartGame from './main';
import authProvider from '@/auth/authProviderSetup';
import { ChatClient } from '@twurple/chat';

// Save the current scene instance
const scene = ref();
const game = ref();
const chatClient = ref();

const emit = defineEmits(
    [
        'current-active-scene',
        'message'
    ]
);

onMounted(async () => {

    game.value = StartGame('game-container');
    let client = new ChatClient({
        authProvider,
        channels: ['superdoutor']
    });

    await client.connect();

    client.onMessage((channel, user, message) => {
        EventBus.emit('message', {
            channel: channel,
            user: user,
            message: message
        });
    });
    
    chatClient.value = client;
});

onUnmounted(() => {

    if (game.value) {
        game.value.destroy(true);
        game.value = null;
    }

});

defineExpose({ scene, game });

</script>

<template>
    <div id="game-container"></div>
</template>