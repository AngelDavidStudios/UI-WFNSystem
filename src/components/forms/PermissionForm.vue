<template>
  <div class="p-6">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="resource" class="block text-sm font-medium text-gray-700 mb-1">
          Recurso
        </label>
        <input
          v-model="formData.resource"
          type="text"
          id="resource"
          required
          placeholder="ej: workspace, user, role"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label for="action" class="block text-sm font-medium text-gray-700 mb-1">
          Acción
        </label>
        <input
          v-model="formData.action"
          type="text"
          id="action"
          required
          placeholder="ej: create, read, update, delete"
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
          {{ permission ? 'Actualizar' : 'Crear' }}
        </BlueprintButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Permission } from '@/types';
import BlueprintButton from '@/components/common/BlueprintButton.vue';

const props = defineProps<{
  permission?: Permission;
}>();

const emit = defineEmits<{
  submit: [data: { resource: string; action: string; description: string }];
  cancel: [];
}>();

const formData = ref({
  resource: props.permission?.resource || '',
  action: props.permission?.action || '',
  description: props.permission?.description || '',
});

watch(() => props.permission, (newPermission) => {
  if (newPermission) {
    formData.value = {
      resource: newPermission.resource,
      action: newPermission.action,
      description: newPermission.description,
    };
  }
});

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
