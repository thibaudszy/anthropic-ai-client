<script setup lang="ts">
import SideBar from "@/components/SideBar.vue";
</script>

<template>
    <div class="app-content">
        <SideBar class="app-sidebar" />
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
    --sidebar-width: 15rem;
    flex-shrink: 0;

    & .app-sidebar {
        width: var(--sidebar-width);
        min-width: var(--sidebar-width);
    }

    & .main-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        height: 100%;
        flex-grow: 1;
        --main-content-width: calc(100dvw - var(--sidebar-width)) width:
            clamp(
                var(--main-content-width),
                var(--main-content-width),
                var(--main-content-width)
            );
    }
}
</style>
