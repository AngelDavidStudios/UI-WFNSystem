<template>
  <div class="p-6">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Rol
        </label>
        <input
          v-model="formData.name"
          type="text"
          id="name"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          v-model="formData.description"
          id="description"
          rows="3"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <BlueprintButton type="button" @click="$emit('cancel')" variant="secondary">
          Cancelar
        </BlueprintButton>
        <BlueprintButton type="submit">
          {{ role ? 'Actualizar' : 'Crear' }}
        </BlueprintButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Role } from '@/types';
import BlueprintButton from '@/components/common/BlueprintButton.vue';

const props = defineProps<{
  role?: Role;
}>();

const emit = defineEmits<{
  submit: [data: { name: string; description: string }];
  cancel: [];
}>();

const formData = ref({
  name: props.role?.name || '',
  description: props.role?.description || '',
});

watch(() => props.role, (newRole) => {
  if (newRole) {
    formData.value = {
      name: newRole.name,
      description: newRole.description,
    };
  }
});

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
