<script setup lang="ts">
import SideBar from "@/components/SideBar.vue";
import { ref } from "vue";

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
    & .main-content-container {
        max-width: calc(100% - var(--sidebar-width));
        display: flex;
        justify-content: center;
        flex-grow: 1;
    }
    & .main-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        height: 100%;
        flex-grow: 1;
        max-width: min(100%, 100rem);
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
</style>
