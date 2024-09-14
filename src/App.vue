<script setup lang="ts">
import SideBar from "@/components/SideBar.vue";
import { ref } from "vue";
import NewChat from "./components/NewChat.vue";

const showApiKeyRequest = ref(false);
if (!localStorage.getItem("anthropic_api_key")) {
    showApiKeyRequest.value = true;
}

const apiKeyInput = ref<string>("");

function handleApiKeySubmit() {
    if (!apiKeyInput.value.trim()) {
        return;
    }
    localStorage.setItem("anthropic_api_key", apiKeyInput.value);
    apiKeyInput.value = "";
    showApiKeyRequest.value = false;
}
</script>

<template>
    <div class="app-content">
        <header class="app-header">
            <RouterLink :to="{ name: 'history' }" class="mobile-link">
                <button class="icon" title="history">
                    <svg
                        class="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"
                            clip-rule="evenodd"
                        />
                        <path
                            d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z"
                        />
                    </svg>
                </button>
            </RouterLink>
            <h1>ChatGPT-4o</h1>
            <NewChat class="mobile-link" />
        </header>
        <div class="flex-content">
            <SideBar class="app-sidebar" />
            <div class="main-content-container">
                <main class="main-content">
                    <form
                        v-if="showApiKeyRequest"
                        class="api-key-form"
                        @submit.prevent="handleApiKeySubmit"
                    >
                        <label>Input the Anthropic API key here </label>
                        <div>
                            <input v-model="apiKeyInput" type="password" />
                            <button>Submit</button>
                        </div>
                    </form>
                    <RouterView v-else />
                </main>
            </div>
        </div>
    </div>
</template>

<style scoped>
.app-content {
    height: 100dvh;
    width: 100%;
    overflow: hidden;
    --sidebar-width: 15rem;
    @media (max-width: 800px) {
        --sidebar-width: 0px;
    }
    flex-shrink: 0;

    & .app-sidebar {
        height: 100dvh;
        overflow: hidden;
        width: var(--sidebar-width);
        min-width: var(--sidebar-width);
        @media (max-width: 800px) {
            display: none;
        }
    }
    & .main-content-container {
        max-width: calc(100% - var(--sidebar-width));
        display: flex;
        justify-content: center;
        flex-grow: 1;
        height: 100dvh;
    }
    & .main-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        height: 100%;
        flex-grow: 1;
        max-width: min(100%, 100rem);
        padding-top: 2.7rem;
    }
}
.api-key-form {
    padding-top: 10dvh;
    display: flex;
    flex-direction: column;
    gap: 1.5 rem;
    & input {
        width: 20rem;
        margin-right: 10px;
        padding: 0.5rem;
    }
}
.app-header {
    width: calc(100% - var(--sidebar-width));
    position: sticky;
    top: 0;
    left: var(--sidebar-width);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    background-color: var(--night);
    @media (max-width: 800px) {
        height: 3rem;
        justify-content: space-between;
        padding-inline: 1rem;
    }
    box-shadow:
        0 4px 6px -1px rgba(255, 255, 255, 0.1),
        0 2px 4px -1px rgba(255, 255, 255, 0.06);
    & .mobile-link {
        display: none;
        @media (max-width: 800px) {
            display: block;
        }
    }
}
.flex-content {
    display: flex;
}
</style>
