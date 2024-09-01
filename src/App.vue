<script setup lang="ts">
import SideBar from "@/components/Sidebar.vue";
import { useChatStore } from "@/store/chat.ts";

const chatStore = useChatStore();

</script>

<template>
    <div class="app-content">
        <SideBar />
        <main class="main-content">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.app-content {
    height: 100dvh;
    width: 100%;
    display: flex;
    overflow: hidden;
}
.main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
