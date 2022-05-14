import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('/src/views/home.vue'),
    },
    {
        path: '/category/:category',
        name: 'Category',
        component: () => import('/src/views/category.vue'),
    },
    {
        path: '/liked',
        name: 'Liked',
        component: () => import('/src/views/likedSongs.vue'),
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;