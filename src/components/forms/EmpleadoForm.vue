<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-blueprint-primary mb-2">
          Persona *
        </label>
        <select
          v-model="formData.iD_Persona"
          required
          class="w-full bg-blueprint-dark border border-blueprint-border rounded px-4 py-2 text-white focus:outline-none focus:border-blueprint-primary"
        >
          <option value="">-- Seleccione una persona --</option>
          <option
            v-for="persona in personas"
            :key="persona.iD_Persona"
            :value="persona.iD_Persona"
          >
            {{ persona.primerNombre }} {{ persona.apellidoPaterno }} ({{ persona.dni }})
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-blueprint-primary mb-2">
          Departamento *
        </label>
        <select
          v-model="formData.iD_Departamento"
          required
          class="w-full bg-blueprint-dark border border-blueprint-border rounded px-4 py-2 text-white focus:outline-none focus:border-blueprint-primary"
        >
          <option value="">-- Seleccione un departamento --</option>
          <option
            v-for="departamento in departamentos"
            :key="departamento.iD_Departamento"
            :value="departamento.iD_Departamento"
          >
            {{ departamento.nombre }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-blueprint-primary mb-2">
          Cuentas Bancarias (mantén presionado Ctrl para selección múltiple)
        </label>
        <select
          v-model="formData.bankingAccounts"
          multiple
          class="w-full bg-blueprint-dark border border-blueprint-border rounded px-4 py-2 text-white focus:outline-none focus:border-blueprint-primary min-h-[120px]"
        >
          <option
            v-for="banco in bancos"
            :key="banco.iD_Banking"
            :value="banco.iD_Banking"
          >
            {{ banco.bankName }} - {{ banco.accountNumber }}
          </option>
        </select>
        <p class="text-xs text-blueprint-light mt-1">
          Selecciona una o más cuentas bancarias
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlueprintInput
          v-model="formData.fechaIngreso"
          label="Fecha de Ingreso"
          type="date"
          required
        />

        <BlueprintInput
          v-model.number="formData.salarioBase"
          label="Salario Base"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-blueprint-primary mb-2">
          Estado Laboral *
        </label>
        <select
          v-model.number="formData.statusLaboral"
          required
          class="w-full bg-blueprint-dark border border-blueprint-border rounded px-4 py-2 text-white focus:outline-none focus:border-blueprint-primary"
        >
          <option :value="0">Inactivo</option>
          <option :value="1">Activo</option>
        </select>
      </div>

      <div class="space-y-3">
        <label class="block text-sm font-medium text-blueprint-primary">
          Beneficios
        </label>
        <div class="space-y-2">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="formData.is_DecimoTercMensual"
              type="checkbox"
              class="w-4 h-4 text-blueprint-primary bg-blueprint-dark border-blueprint-border rounded focus:ring-blueprint-primary focus:ring-2"
            />
            <span class="text-white">Décimo Tercero Mensual</span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="formData.is_DecimoCuartoMensual"
              type="checkbox"
              class="w-4 h-4 text-blueprint-primary bg-blueprint-dark border-blueprint-border rounded focus:ring-blueprint-primary focus:ring-2"
            />
            <span class="text-white">Décimo Cuarto Mensual</span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="formData.is_FondoReserva"
              type="checkbox"
              class="w-4 h-4 text-blueprint-primary bg-blueprint-dark border-blueprint-border rounded focus:ring-blueprint-primary focus:ring-2"
            />
            <span class="text-white">Fondo de Reserva</span>
          </label>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-blueprint-border">
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
import { ref, watch, onMounted } from 'vue';
import { usePersonaStore } from '@/stores/persona.store';
import { useDepartamentoStore } from '@/stores/departamento.store';
import { useBancoStore } from '@/stores/banco.store';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import type { Empleado, EmpleadoFormData } from '@/types';

interface Props {
  empleado?: Empleado | null;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  empleado: null,
  isEditing: false
});

const emit = defineEmits<{
  submit: [data: EmpleadoFormData];
  cancel: [];
}>();

const personaStore = usePersonaStore();
const departamentoStore = useDepartamentoStore();
const bancoStore = useBancoStore();

const personas = ref(personaStore.personas);
const departamentos = ref(departamentoStore.departamentos);
const bancos = ref(bancoStore.bancos);

const formData = ref<EmpleadoFormData>({
  iD_Persona: '',
  bankingAccounts: [],
  iD_Departamento: '',
  fechaIngreso: new Date().toISOString().split('T')[0],
  salarioBase: 0,
  is_DecimoTercMensual: false,
  is_DecimoCuartoMensual: false,
  is_FondoReserva: false,
  statusLaboral: 1
});

onMounted(async () => {
  await Promise.all([
    personaStore.fetchAll(),
    departamentoStore.fetchAll(),
    bancoStore.fetchAll()
  ]);

  personas.value = personaStore.personas;
  departamentos.value = departamentoStore.departamentos;
  bancos.value = bancoStore.bancos;
});

watch(
  () => props.empleado,
  (newEmpleado) => {
    if (newEmpleado) {
      formData.value = {
        iD_Persona: newEmpleado.iD_Persona || '',
        bankingAccounts: newEmpleado.bankingAccounts.map(b => b.iD_Banking || '').filter(id => id),
        iD_Departamento: newEmpleado.iD_Departamento || '',
        fechaIngreso: newEmpleado.fechaIngreso ? newEmpleado.fechaIngreso.split('T')[0] : new Date().toISOString().split('T')[0],
        salarioBase: newEmpleado.salarioBase || 0,
        is_DecimoTercMensual: newEmpleado.is_DecimoTercMensual || false,
        is_DecimoCuartoMensual: newEmpleado.is_DecimoCuartoMensual || false,
        is_FondoReserva: newEmpleado.is_FondoReserva || false,
        statusLaboral: newEmpleado.statusLaboral || 0
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
