<script setup lang="ts">
import SideBar from "@/components/SideBar.vue";
import { ref, nextTick } from "vue";
import NewChat from "./components/NewChat.vue";
import { vOnClickOutside } from "@vueuse/components";
import { router } from "./router/router";

const showApiKeyRequest = ref(false);
if (!localStorage.getItem("openai_api_key")) {
    showApiKeyRequest.value = true;
}

const apiKeyInput = ref<string>("");

function handleApiKeySubmit() {
    if (!apiKeyInput.value.trim()) {
        return;
    }
    localStorage.setItem("openai_api_key", apiKeyInput.value);
    apiKeyInput.value = "";
    showApiKeyRequest.value = false;
}

const isPopupOpen = ref<boolean>(false);
function togglePopup() {
    isPopupOpen.value = !isPopupOpen.value;
}

function resetApiKey() {
    localStorage.removeItem("openai_api_key");
    router.push({ name: "home" });
    location.reload();
}
</script>

<template>
    <div class="app-content">
        <header class="app-header">
            <NewChat class="mobile-link" />
            <h1>ChatGPT-4o</h1>
            <div
                class="menu-container"
                v-on-click-outside="() => (isPopupOpen = false)"
            >
                <button class="icon" title="menu" @click="togglePopup">
                    <svg
                        class="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-width="2"
                            d="M5 7h14M5 12h14M5 17h14"
                        />
                    </svg>
                </button>
                <div
                    v-show="isPopupOpen"
                    class="popup"
                    :class="{ open: isPopupOpen }"
                    @click="isPopupOpen = false"
                >
                    <RouterLink
                        class="button ghost chat-history-link"
                        :to="{ name: 'history' }"
                    >
                        Chat history
                    </RouterLink>
                    <button class="ghost" @click="resetApiKey">
                        Reset API key
                    </button>
                </div>
            </div>
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
                        <label>Input the OpenAi API key here </label>
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
    justify-content: space-between;
    padding-inline: 1rem;
    @media (max-width: 800px) {
        height: 3rem;
    }
    box-shadow:
        0 4px 6px -1px rgba(255, 255, 255, 0.1),
        0 2px 4px -1px rgba(255, 255, 255, 0.06);
    & .mobile-link {
        visibility: hidden;
        @media (max-width: 800px) {
            visibility: visible;
        }
    }
}
.flex-content {
    display: flex;
}

.menu-container {
    position: relative;
}
.popup {
    font-size: large;
    position: absolute;
    top: 105%;
    right: 0;
    background-color: black;
    border-radius: 1rem;
    padding: 1rem;
    width: 15rem;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    box-shadow:
        0 4px 6px -1px rgba(255, 255, 255, 0.1),
        0 2px 4px -1px rgba(255, 255, 255, 0.06),
        0 -4px 6px -1px rgba(255, 255, 255, 0.1),
        0 -2px 4px -1px rgba(255, 255, 255, 0.06),
        4px 0 6px -1px rgba(255, 255, 255, 0.1),
        -4px 0 6px -1px rgba(255, 255, 255, 0.1);

    & .chat-history-link {
        @media (min-width: 800px) {
            display: none;
        }
    }
}
</style>
