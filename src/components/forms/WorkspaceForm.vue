<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlueprintInput
          label="Fecha Creación"
          type="date"
          v-model="formData.fechaCreacion"
          required
        />

        <BlueprintInput
          label="Fecha Cierre"
          type="date"
          v-model="formData.fechaCierre"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-blueprint-light mb-2">
          Estado *
        </label>
        <select
          v-model.number="formData.estado"
          required
          class="w-full bg-blueprint-dark/30 border border-blueprint-primary/30 rounded-lg px-4 py-2.5 text-blueprint-light focus:outline-none focus:border-blueprint-primary transition-colors"
        >
          <option value="" disabled>Seleccione un estado</option>
          <option :value="0">Activo</option>
          <option :value="1">Cerrado</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-6 border-t border-blueprint-primary/20">
      <BlueprintButton
        type="button"
        variant="secondary"
        @click="$emit('cancel')"
      >
        Cancelar
      </BlueprintButton>
      <BlueprintButton type="submit" variant="primary">
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Workspace
      </BlueprintButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import type { WorkspaceFormData, Workspace } from '@/types';

const props = defineProps<{
  workspace?: Workspace;
  isEditMode?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: WorkspaceFormData];
  cancel: [];
}>();

const formData = ref<WorkspaceFormData>({
  fechaCreacion: new Date().toISOString().split('T')[0],
  fechaCierre: '',
  estado: 0,
});

watch(
  () => props.workspace,
  (newWorkspace) => {
    if (newWorkspace && props.isEditMode) {
      formData.value = {
        fechaCreacion: newWorkspace.fechaCreacion.split('T')[0],
        fechaCierre: newWorkspace.fechaCierre.split('T')[0],
        estado: newWorkspace.estado,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
