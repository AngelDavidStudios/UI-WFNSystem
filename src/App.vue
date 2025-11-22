<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuthListener();
  authStore.checkAuth();
});
</script>
