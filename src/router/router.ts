import {
    createWebHistory,
    createRouter,
    type RouteRecordRaw,
} from "vue-router";
import Homeview from "@/views/Homeview.vue";
import ChatHistory from "@/components/ChatHistory.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home", // Optional: You can add a name if you want
        component: Homeview,
    },
    {
        path: "/history",
        name: "history",
        component: ChatHistory,
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
