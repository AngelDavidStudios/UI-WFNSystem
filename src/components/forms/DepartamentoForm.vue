<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BlueprintInput
        v-model="formData.nombre"
        label="Nombre"
        placeholder="Ingrese el nombre del departamento"
        required
      />

      <BlueprintInput
        v-model="formData.ubicacion"
        label="Ubicación"
        placeholder="Ingrese la ubicación"
        required
      />

      <BlueprintInput
        v-model="formData.email"
        label="Email"
        type="email"
        placeholder="correo@ejemplo.com"
        required
      />

      <BlueprintInput
        v-model="formData.telefono"
        label="Teléfono"
        placeholder="Ingrese el teléfono"
        required
      />

      <BlueprintInput
        v-model="formData.cargo"
        label="Cargo"
        placeholder="Ingrese el cargo"
        required
      />

      <BlueprintInput
        v-model="formData.centroCosto"
        label="Centro de Costo"
        placeholder="Ingrese el centro de costo"
        required
      />
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <BlueprintButton
        type="button"
        variant="secondary"
        @click="$emit('cancel')"
      >
        Cancelar
      </BlueprintButton>
      <BlueprintButton type="submit" variant="primary">
        {{ isEditing ? 'Actualizar' : 'Crear' }}
      </BlueprintButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import type { Departamento, DepartamentoFormData } from '@/types';

interface Props {
  departamento?: Departamento | null;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  departamento: null,
  isEditing: false
});

const emit = defineEmits<{
  submit: [data: DepartamentoFormData];
  cancel: [];
}>();

const formData = ref<DepartamentoFormData>({
  nombre: '',
  ubicacion: '',
  email: '',
  telefono: '',
  cargo: '',
  centroCosto: ''
});

watch(
  () => props.departamento,
  (newDepartamento) => {
    if (newDepartamento) {
      formData.value = {
        nombre: newDepartamento.nombre || '',
        ubicacion: newDepartamento.ubicacion || '',
        email: newDepartamento.email || '',
        telefono: newDepartamento.telefono || '',
        cargo: newDepartamento.cargo || '',
        centroCosto: newDepartamento.centroCosto || ''
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
