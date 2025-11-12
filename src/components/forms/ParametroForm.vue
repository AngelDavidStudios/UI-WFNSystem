<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6">
      <BlueprintInput
        label="Tipo"
        v-model="formData.tipo"
        placeholder="Ej: Salario Mínimo"
        required
      />

      <div>
        <label class="block text-sm font-medium text-blueprint-light mb-2">
          Descripción *
        </label>
        <textarea
          v-model="formData.descripcion"
          required
          rows="4"
          placeholder="Descripción del parámetro"
          class="w-full bg-blueprint-dark/30 border border-blueprint-primary/30 rounded-lg px-4 py-2.5 text-blueprint-light focus:outline-none focus:border-blueprint-primary transition-colors resize-none"
        ></textarea>
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
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Parámetro
      </BlueprintButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import type { ParametroFormData, Parametro } from '@/types';

const props = defineProps<{
  parametro?: Parametro;
  isEditMode?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: ParametroFormData];
  cancel: [];
}>();

const formData = ref<ParametroFormData>({
  tipo: '',
  descripcion: '',
});

watch(
  () => props.parametro,
  (newParametro) => {
    if (newParametro && props.isEditMode) {
      formData.value = {
        tipo: newParametro.tipo,
        descripcion: newParametro.descripcion,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
