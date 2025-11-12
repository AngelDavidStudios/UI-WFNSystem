import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(true);
  const isMobile = ref(window.innerWidth < 768);

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  const closeSidebar = () => {
    sidebarOpen.value = false;
  };

  const openSidebar = () => {
    sidebarOpen.value = true;
  };

  const setMobile = (value: boolean) => {
    isMobile.value = value;
  };

  return {
    sidebarOpen,
    isMobile,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    setMobile,
  };
});
