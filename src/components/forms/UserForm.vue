<template>
  <div class="p-6">
    <h3 class="text-lg font-semibold mb-6">Crear Nuevo Usuario</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <BlueprintInput
          v-model="formData.email"
          type="email"
          placeholder="usuario@ejemplo.com"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <BlueprintInput
          v-model="formData.password"
          type="password"
          placeholder="Contraseña segura"
          required
        />
        <p class="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Rol
        </label>
        <select
          v-model="formData.role_id"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccionar rol</option>
          <option v-for="role in rolesStore.roles" :key="role.id" :value="role.id">
            {{ role.name }} - {{ role.description }}
          </option>
        </select>
      </div>

      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <BlueprintButton
          type="button"
          @click="handleCancel"
          variant="secondary"
        >
          Cancelar
        </BlueprintButton>
        <BlueprintButton
          type="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creando...' : 'Crear Usuario' }}
        </BlueprintButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRolesStore } from '@/stores/roles.store';
import type { UserRegistration } from '@/types';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';

const emit = defineEmits<{
  submit: [registration: UserRegistration];
  cancel: [];
}>();

const rolesStore = useRolesStore();

const formData = ref<UserRegistration>({
  email: '',
  password: '',
  role_id: '',
});

const isLoading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  if (rolesStore.roles.length === 0) {
    await rolesStore.loadRoles();
  }
});

const handleSubmit = (): void => {
  error.value = null;

  if (!formData.value.email || !formData.value.password || !formData.value.role_id) {
    error.value = 'Todos los campos son requeridos';
    return;
  }

  if (formData.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  emit('submit', formData.value);
};

const handleCancel = (): void => {
  emit('cancel');
};
</script>
