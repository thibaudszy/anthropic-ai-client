import { createWebHistory, createRouter } from "vue-router";
import Homeview from "@/views/Homeview.vue";

const routes = [{ name: "/", component: Homeview }];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
