<template>
  <button
    :type="type"
    :disabled="disabled"
    class="blueprint-button px-6 py-2.5 uppercase tracking-wider text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClasses"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border-white text-white hover:bg-white hover:text-blueprint-bg';
    case 'outline':
      return 'border-blueprint-light text-blueprint-light hover:bg-blueprint-light hover:text-blueprint-bg';
    default:
      return '';
  }
});
</script>
