<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6">
      <div>
        <label class="block text-sm font-medium text-blueprint-light mb-2">
          Parámetro *
        </label>
        <select
          v-model="formData.iD_Parametro"
          required
          class="w-full bg-blueprint-dark/30 border border-blueprint-primary/30 rounded-lg px-4 py-2.5 text-blueprint-light focus:outline-none focus:border-blueprint-primary transition-colors"
        >
          <option value="" disabled>Seleccione un parámetro</option>
          <option
            v-for="parametro in parametros"
            :key="parametro.iD_Parametro"
            :value="parametro.iD_Parametro"
          >
            {{ parametro.tipo }} - {{ parametro.descripcion }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlueprintInput
          label="Fecha Ingresada"
          type="date"
          v-model="formData.fechaIngresada"
          required
        />

        <div>
          <label class="block text-sm font-medium text-blueprint-light mb-2">
            Tipo de Novedad *
          </label>
          <select
            v-model="formData.tipoNovedad"
            required
            class="w-full bg-blueprint-dark/30 border border-blueprint-primary/30 rounded-lg px-4 py-2.5 text-blueprint-light focus:outline-none focus:border-blueprint-primary transition-colors"
          >
            <option value="" disabled>Seleccione un tipo</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-blueprint-light mb-2">
          Descripción *
        </label>
        <textarea
          v-model="formData.descripcion"
          required
          rows="3"
          placeholder="Descripción de la novedad"
          class="w-full bg-blueprint-dark/30 border border-blueprint-primary/30 rounded-lg px-4 py-2.5 text-blueprint-light focus:outline-none focus:border-blueprint-primary transition-colors resize-none"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlueprintInput
          label="Monto Aplicado"
          type="number"
          step="0.01"
          v-model.number="formData.montoAplicado"
          placeholder="0.00"
          required
        />

        <div>
          <label class="block text-sm font-medium text-blueprint-light mb-2">
            Gravable
          </label>
          <div class="flex items-center gap-4 h-11">
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                v-model="formData.is_Gravable"
                :value="true"
                class="w-4 h-4 text-blueprint-primary bg-blueprint-dark/30 border-blueprint-primary/30 focus:ring-blueprint-primary focus:ring-2"
              />
              <span class="ml-2 text-blueprint-light">Sí</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                type="radio"
                v-model="formData.is_Gravable"
                :value="false"
                class="w-4 h-4 text-blueprint-primary bg-blueprint-dark/30 border-blueprint-primary/30 focus:ring-blueprint-primary focus:ring-2"
              />
              <span class="ml-2 text-blueprint-light">No</span>
            </label>
          </div>
        </div>
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
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Novedad
      </BlueprintButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import { useParametroStore } from '@/stores/parametro.store';
import type { NovedadFormData, Novedad } from '@/types';

const props = defineProps<{
  novedad?: Novedad;
  isEditMode?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: NovedadFormData];
  cancel: [];
}>();

const parametroStore = useParametroStore();
const parametros = ref(parametroStore.parametros);

const formData = ref<NovedadFormData>({
  iD_Parametro: '',
  fechaIngresada: new Date().toISOString().split('T')[0],
  tipoNovedad: '',
  descripcion: '',
  montoAplicado: 0,
  is_Gravable: true,
});

watch(
  () => props.novedad,
  (newNovedad) => {
    if (newNovedad && props.isEditMode) {
      formData.value = {
        iD_Parametro: newNovedad.iD_Parametro,
        fechaIngresada: newNovedad.fechaIngresada.split('T')[0],
        tipoNovedad: newNovedad.tipoNovedad,
        descripcion: newNovedad.descripcion,
        montoAplicado: newNovedad.montoAplicado,
        is_Gravable: newNovedad.is_Gravable,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', formData.value);
};

onMounted(async () => {
  if (parametroStore.parametros.length === 0) {
    await parametroStore.fetchAll();
  }
  parametros.value = parametroStore.parametros;
});
</script>
