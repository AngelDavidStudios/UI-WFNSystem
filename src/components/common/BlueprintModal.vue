<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
        @click.self="handleClose"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="show"
            :class="[
              'blueprint-card w-full max-h-[90vh] overflow-y-auto',
              size === 'sm' ? 'max-w-md' : '',
              size === 'md' ? 'max-w-2xl' : '',
              size === 'lg' ? 'max-w-4xl' : '',
              size === 'xl' ? 'max-w-6xl' : '',
              size === 'large' ? 'max-w-5xl' : ''
            ]"
          >
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
              <h2 class="text-2xl font-bold text-blueprint-primary text-shadow-glow uppercase">
                {{ title }}
              </h2>
              <button
                @click="handleClose"
                class="text-blueprint-light hover:text-blueprint-primary transition-colors p-2"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <div class="mb-6">
              <slot />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/20">
              <slot name="footer">
                <BlueprintButton
                  variant="secondary"
                  @click="handleClose"
                >
                  Cancelar
                </BlueprintButton>
                <BlueprintButton @click="handleConfirm">
                  Confirmar
                </BlueprintButton>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
import BlueprintButton from './BlueprintButton.vue';

interface Props {
  show: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'large';
}

withDefaults(defineProps<Props>(), {
  size: 'md',
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const handleClose = () => {
  emit('close');
};

const handleConfirm = () => {
  emit('confirm');
};
</script>
