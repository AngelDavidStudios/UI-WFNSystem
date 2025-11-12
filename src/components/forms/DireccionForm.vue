<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BlueprintInput
        v-model="formData.calle"
        label="Calle"
        placeholder="Ingrese la calle"
        required
      />

      <BlueprintInput
        v-model="formData.numero"
        label="Número"
        placeholder="Ingrese el número"
        required
      />

      <div class="md:col-span-2">
        <BlueprintInput
          v-model="formData.piso"
          label="Piso"
          placeholder="Ingrese el piso/departamento"
          required
        />
      </div>
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
import type { Direccion, DireccionFormData } from '@/types';

interface Props {
  direccion?: Direccion | null;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  direccion: null,
  isEditing: false
});

const emit = defineEmits<{
  submit: [data: DireccionFormData];
  cancel: [];
}>();

const formData = ref<DireccionFormData>({
  calle: '',
  numero: '',
  piso: ''
});

watch(
  () => props.direccion,
  (newDireccion) => {
    if (newDireccion) {
      formData.value = {
        calle: newDireccion.calle || '',
        numero: newDireccion.numero || '',
        piso: newDireccion.piso || ''
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
