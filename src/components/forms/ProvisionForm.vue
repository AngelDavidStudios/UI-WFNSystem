<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-blueprint-light mb-2">
          Empleado *
        </label>
        <select
          v-model="formData.iD_Empleado"
          required
          class="w-full bg-blueprint-dark/30 border border-blueprint-primary/30 rounded-lg px-4 py-2.5 text-blueprint-light focus:outline-none focus:border-blueprint-primary transition-colors"
        >
          <option value="">Seleccione un empleado</option>
          <option
            v-for="empleado in empleados"
            :key="empleado.iD_Empleado"
            :value="empleado.iD_Empleado"
          >
            {{ getEmpleadoName(empleado) }}
          </option>
        </select>
      </div>

      <BlueprintInput
        label="Tipo de Provisión"
        v-model="formData.tipoProvision"
        placeholder="Ej: Décimo Tercero"
        required
      />

      <BlueprintInput
        label="Periodo"
        v-model="formData.periodo"
        placeholder="Ej: 2024-01"
        required
      />

      <BlueprintInput
        label="Valor Mensual"
        type="number"
        step="0.01"
        v-model.number="formData.valorMensual"
        placeholder="0.00"
        required
      />

      <BlueprintInput
        label="Acumulado"
        type="number"
        step="0.01"
        v-model.number="formData.acumulado"
        placeholder="0.00"
        required
      />

      <BlueprintInput
        label="Total"
        type="number"
        step="0.01"
        v-model.number="formData.total"
        placeholder="0.00"
        required
      />

      <div class="flex items-center">
        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            v-model="formData.isTrasnferred"
            class="w-5 h-5 rounded border-blueprint-primary/30 bg-blueprint-dark/30 text-blueprint-primary focus:ring-2 focus:ring-blueprint-primary/50 focus:ring-offset-0"
          />
          <span class="text-sm font-medium text-blueprint-light">
            Transferido
          </span>
        </label>
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
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Provisión
      </BlueprintButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import type { ProvisionFormData, Provision, Empleado } from '@/types';
import { useEmpleadoStore } from '@/stores/empleado.store';
import { usePersonaStore } from '@/stores/persona.store';

const props = defineProps<{
  provision?: Provision;
  isEditMode?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: ProvisionFormData];
  cancel: [];
}>();

const empleadoStore = useEmpleadoStore();
const personaStore = usePersonaStore();

const empleados = ref<Empleado[]>([]);

const formData = ref<ProvisionFormData>({
  iD_Empleado: '',
  tipoProvision: '',
  periodo: '',
  valorMensual: 0,
  acumulado: 0,
  total: 0,
  isTrasnferred: false,
});

const getEmpleadoName = (empleado: Empleado): string => {
  const persona = personaStore.personas.find(p => p.iD_Persona === empleado.iD_Persona);
  if (persona) {
    return `${persona.primerNombre} ${persona.apellidoPaterno}`;
  }
  return empleado.iD_Empleado || '';
};

watch(
  () => props.provision,
  (newProvision) => {
    if (newProvision && props.isEditMode) {
      formData.value = {
        iD_Empleado: newProvision.iD_Empleado,
        tipoProvision: newProvision.tipoProvision,
        periodo: newProvision.periodo,
        valorMensual: newProvision.valorMensual,
        acumulado: newProvision.acumulado,
        total: newProvision.total,
        isTrasnferred: newProvision.isTrasnferred,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', formData.value);
};

onMounted(async () => {
  if (empleadoStore.empleados.length === 0) {
    await empleadoStore.fetchAll();
  }
  if (personaStore.personas.length === 0) {
    await personaStore.fetchAll();
  }
  empleados.value = empleadoStore.empleados;
});
</script>
