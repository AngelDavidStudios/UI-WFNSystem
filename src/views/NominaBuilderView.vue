<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Constructor de Nómina</h1>
      <div class="flex space-x-3">
        <BlueprintButton @click="handleSave" :disabled="!canSave">
          {{ isEditMode ? 'Actualizar' : 'Guardar' }} Nómina
        </BlueprintButton>
        <BlueprintButton @click="handleCancel" variant="secondary">
          Cancelar
        </BlueprintButton>
      </div>
    </div>

    <BlueprintCard>
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Empleado <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.iD_Empleado"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">
                {{ empleados.length === 0 ? 'Cargando empleados...' : 'Seleccione un empleado' }}
              </option>
              <option
                v-for="info in getEmpleadoInfo"
                :key="info.id"
                :value="info.id"
              >
                {{ info.displayName }}
              </option>
            </select>
            <p v-if="empleados.length === 0" class="mt-2 text-sm text-amber-600">
              No hay empleados disponibles. Por favor, cree un empleado primero.
            </p>
          </div>

          <BlueprintInput
            label="Período (Mes/Año)"
            v-model="formData.periodo"
            type="month"
            required
          />
        </div>

        <div class="border-t pt-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Ingresos</h2>
            <BlueprintButton @click="addIngreso" variant="secondary" size="sm">
              Agregar Ingreso
            </BlueprintButton>
          </div>

          <div v-if="ingresos.length === 0" class="text-center py-8 text-gray-500">
            No hay ingresos. Haga clic en "Agregar Ingreso" para comenzar.
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="(ingreso, index) in ingresos"
              :key="index"
              class="p-6 border-2 border-gray-200 rounded-lg bg-white"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Ingreso #{{ index + 1 }}</h3>
                <button
                  @click="removeIngreso(index)"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  Eliminar Ingreso
                </button>
              </div>

              <NovedadBuilderForm
                :title="`Novedades del Ingreso #${index + 1}`"
                v-model="ingreso.novedades"
                tipo-filtro="Ingreso"
              />

              <div class="mt-4 p-4 bg-green-50 rounded-lg space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-gray-700">Subtotal Gravado IESS:</span>
                  <span class="font-semibold text-gray-900">${{ calculateIngresoGravado(ingreso.novedades).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-gray-700">Subtotal No Gravado IESS:</span>
                  <span class="font-semibold text-gray-900">${{ calculateIngresoNoGravado(ingreso.novedades).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-base font-bold border-t pt-2">
                  <span class="text-gray-900">Total Ingreso:</span>
                  <span class="text-green-600">${{ calculateIngresoTotal(ingreso.novedades).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Egresos</h2>
            <BlueprintButton @click="addEgreso" variant="secondary" size="sm">
              Agregar Egreso
            </BlueprintButton>
          </div>

          <div v-if="egresos.length === 0" class="text-center py-8 text-gray-500">
            No hay egresos. Haga clic en "Agregar Egreso" para comenzar.
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="(egreso, index) in egresos"
              :key="index"
              class="p-6 border-2 border-gray-200 rounded-lg bg-white"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Egreso #{{ index + 1 }}</h3>
                <button
                  @click="removeEgreso(index)"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  Eliminar Egreso
                </button>
              </div>

              <NovedadBuilderForm
                :title="`Novedades del Egreso #${index + 1}`"
                v-model="egreso.novedades"
                tipo-filtro="Egreso"
              />

              <div class="mt-4 p-4 bg-red-50 rounded-lg">
                <div class="flex justify-between text-base font-bold">
                  <span class="text-gray-900">Total Egreso:</span>
                  <span class="text-red-600">${{ calculateEgresoTotal(egreso.novedades).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t pt-6">
          <div class="p-6 bg-blue-50 rounded-lg space-y-3">
            <div class="flex justify-between text-lg">
              <span class="font-semibold text-gray-700">Total Ingresos:</span>
              <span class="font-bold text-green-600">${{ totalIngresos.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg">
              <span class="font-semibold text-gray-700">Total Egresos:</span>
              <span class="font-bold text-red-600">${{ totalEgresos.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-2xl font-bold border-t pt-3">
              <span class="text-gray-900">Neto a Pagar:</span>
              <span class="text-blue-600">${{ netoAPagar.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </BlueprintCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import NovedadBuilderForm from '@/components/forms/NovedadBuilderForm.vue';
import { useNominaStore } from '@/stores/nomina.store';
import { useEmpleadoStore } from '@/stores/empleado.store';
import { usePersonaStore } from '@/stores/persona.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import type { NominaFormData, IngresoFormData, EgresoFormData, NovedadNomina } from '@/types';

const router = useRouter();
const route = useRoute();
const nominaStore = useNominaStore();
const empleadoStore = useEmpleadoStore();
const personaStore = usePersonaStore();
const workspaceStore = useWorkspaceStore();

const isEditMode = ref(false);
const nominaId = ref<string | undefined>();

const formData = ref<NominaFormData>({
  iD_Empleado: '',
  periodo: '',
  ingresos: [],
  egresos: []
});

const ingresos = ref<IngresoFormData[]>([]);
const egresos = ref<EgresoFormData[]>([]);

const empleados = computed(() => empleadoStore.empleados);

const getEmpleadoInfo = computed(() => {
  return empleados.value.map(emp => {
    const persona = personaStore.personas.find(p => p.iD_Persona === emp.iD_Persona);
    if (persona) {
      return {
        id: emp.iD_Empleado,
        nombre: `${persona.primerNombre} ${persona.segundoNombre ? persona.segundoNombre + ' ' : ''}${persona.apellidoPaterno} ${persona.apellidoMaterno}`,
        dni: persona.dni,
        displayName: `${persona.primerNombre} ${persona.segundoNombre ? persona.segundoNombre + ' ' : ''}${persona.apellidoPaterno} ${persona.apellidoMaterno} - DNI: ${persona.dni}`
      };
    }
    return null;
  }).filter(e => e !== null);
});

const calculateIngresoGravado = (novedades: NovedadNomina[]) => {
  return novedades.filter(n => n.is_Gravable).reduce((sum, n) => sum + (n.montoAplicado || 0), 0);
};

const calculateIngresoNoGravado = (novedades: NovedadNomina[]) => {
  return novedades.filter(n => !n.is_Gravable).reduce((sum, n) => sum + (n.montoAplicado || 0), 0);
};

const calculateIngresoTotal = (novedades: NovedadNomina[]) => {
  return novedades.reduce((sum, n) => sum + (n.montoAplicado || 0), 0);
};

const calculateEgresoTotal = (novedades: NovedadNomina[]) => {
  return novedades.reduce((sum, n) => sum + (n.montoAplicado || 0), 0);
};

const totalIngresos = computed(() => {
  return ingresos.value.reduce((sum, ing) => sum + calculateIngresoTotal(ing.novedades), 0);
});

const totalEgresos = computed(() => {
  return egresos.value.reduce((sum, egr) => sum + calculateEgresoTotal(egr.novedades), 0);
});

const netoAPagar = computed(() => {
  return totalIngresos.value - totalEgresos.value;
});

const canSave = computed(() => {
  return formData.value.iD_Empleado && formData.value.periodo;
});

const addIngreso = () => {
  ingresos.value.push({
    novedades: []
  });
};

const removeIngreso = (index: number) => {
  ingresos.value.splice(index, 1);
};

const addEgreso = () => {
  egresos.value.push({
    novedades: []
  });
};

const removeEgreso = (index: number) => {
  egresos.value.splice(index, 1);
};

const handleSave = async () => {
  formData.value.ingresos = ingresos.value;
  formData.value.egresos = egresos.value;

  const workspaceId = route.params.id as string;

  try {
    if (isEditMode.value && nominaId.value) {
      await nominaStore.update(nominaId.value, formData.value);
    } else {
      await nominaStore.create(formData.value);
    }

    await nominaStore.fetchAll();

    if (workspaceId) {
      const workspace = await workspaceStore.fetchById(workspaceId);
      if (workspace) {
        const allNominas = nominaStore.nominas;
        await workspaceStore.update(workspaceId, {
          nominas: allNominas
        });
        await workspaceStore.fetchById(workspaceId);
      }
      router.push(`/workspaces/${workspaceId}`);
    } else {
      router.push('/workspaces');
    }
  } catch (error) {
    console.error('Error al guardar nómina:', error);
  }
};

const handleCancel = () => {
  const workspaceId = route.params.id;
  if (workspaceId) {
    router.push(`/workspaces/${workspaceId}`);
  } else {
    router.push('/workspaces');
  }
};

onMounted(async () => {
  if (empleadoStore.empleados.length === 0) {
    await empleadoStore.fetchAll();
  }
  if (personaStore.personas.length === 0) {
    await personaStore.fetchAll();
  }

  if (route.params.nominaId) {
    isEditMode.value = true;
    nominaId.value = route.params.nominaId as string;
    const nomina = await nominaStore.fetchById(nominaId.value);
    if (nomina) {
      formData.value.iD_Empleado = nomina.iD_Empleado;
      formData.value.periodo = nomina.periodo;
      ingresos.value = nomina.ingresos.map(ing => ({ novedades: ing.novedades }));
      egresos.value = nomina.egresos.map(egr => ({ novedades: egr.novedades }));
    }
  }
});
</script>
