<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <BlueprintButton @click="showAddModal = true" variant="secondary" size="sm">
        Agregar Novedad Existente
      </BlueprintButton>
    </div>

    <div v-if="localNovedades.length === 0" class="text-center py-8 text-gray-500">
      No hay novedades. Haga clic en "Agregar Novedad Existente" para comenzar.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(novedad, index) in localNovedades"
        :key="index"
        class="p-4 border border-gray-200 rounded-lg bg-gray-50"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Novedad</label>
            <div class="p-3 bg-white rounded border border-gray-200">
              <div class="text-sm">
                <p class="font-semibold text-gray-900">{{ novedad.descripcion }}</p>
                <p class="text-gray-600 mt-1">
                  <span class="font-medium">Tipo:</span> {{ novedad.tipoNovedad }} |
                  <span class="font-medium">Fecha:</span> {{ formatDate(novedad.fechaIngresada) }}
                </p>
                <p class="text-gray-600">
                  <span class="font-medium">Parámetro:</span> {{ getParametroName(novedad.iD_Parametro) }}
                  <span v-if="novedad.is_Gravable" class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Gravable IESS
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <BlueprintInput
              label="Monto Aplicado"
              v-model.number="novedad.montoAplicado"
              type="number"
              step="0.01"
              required
            />
          </div>

          <div class="md:col-span-3 flex justify-end">
            <button
              @click="removeNovedad(index)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 p-4 bg-blue-50 rounded-lg">
      <div class="text-sm font-medium text-gray-700">
        Total: ${{ totalAmount.toFixed(2) }}
      </div>
    </div>

    <BlueprintModal
      :show="showAddModal"
      @close="closeModal"
      title="Seleccionar Novedad"
      size="lg"
    >
      <div class="space-y-4">
        <div class="flex justify-end">
          <button
            @click="reloadNovedades"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            🔄 Recargar Novedades
          </button>
        </div>
        <div v-if="novedadStore.isLoading" class="text-center py-8">
          <p class="text-gray-500">Cargando novedades...</p>
        </div>

        <div v-else-if="availableNovedades.length === 0" class="text-center py-8 text-gray-500">
          <p class="mb-2">No hay novedades disponibles {{ props.tipoFiltro ? `de tipo "${props.tipoFiltro}"` : '' }}.</p>
          <p class="text-sm text-gray-400">Por favor, cree novedades primero en el módulo de Nómina Workspace > Novedades.</p>
          <p class="text-xs text-gray-400 mt-2">Total de novedades en sistema: {{ novedades.length }}</p>
        </div>

        <div v-else class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="nov in availableNovedades"
            :key="nov.iD_Novedad"
            @click="selectNovedad(nov)"
            class="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-semibold text-gray-900">{{ nov.descripcion }}</p>
                <p class="text-sm text-gray-600 mt-1">
                  <span class="font-medium">Tipo:</span> {{ nov.tipoNovedad }} |
                  <span class="font-medium">Fecha:</span> {{ formatDate(nov.fechaIngresada) }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Parámetro:</span> {{ getParametroName(nov.iD_Parametro) }}
                </p>
              </div>
              <div class="flex flex-col items-end space-y-1">
                <span v-if="nov.is_Gravable" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Gravable IESS
                </span>
                <span v-else class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  No Gravable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <BlueprintButton variant="secondary" @click="closeModal">
          Cerrar
        </BlueprintButton>
      </template>
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import { useParametroStore } from '@/stores/parametro.store';
import { useNovedadStore } from '@/stores/novedad.store';
import type { NovedadNomina, Novedad } from '@/types';

interface Props {
  title: string;
  modelValue: NovedadNomina[];
  tipoFiltro?: 'Ingreso' | 'Egreso';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: NovedadNomina[]): void;
}>();

const parametroStore = useParametroStore();
const novedadStore = useNovedadStore();

const showAddModal = ref(false);
const localNovedades = ref<NovedadNomina[]>([...props.modelValue]);

const parametros = computed(() => parametroStore.parametros);
const novedades = computed(() => novedadStore.novedades);

const availableNovedades = computed(() => {
  if (props.tipoFiltro) {
    return novedades.value.filter(n => n.tipoNovedad === props.tipoFiltro);
  }
  return novedades.value;
});

watch(availableNovedades, (newValue) => {
  console.log('=== AVAILABLE NOVEDADES CHANGED ===');
  console.log('Total novedades disponibles:', newValue.length);
  console.log('Tipo filtro:', props.tipoFiltro);
  if (newValue.length > 0) {
    console.log('Muestra:', newValue.slice(0, 2));
  }
}, { immediate: true });

watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(localNovedades.value)) {
      localNovedades.value = [...newValue];
    }
  },
  { deep: true }
);

watch(
  localNovedades,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(props.modelValue)) {
      emit('update:modelValue', [...newValue]);
    }
  },
  { deep: true }
);

const totalAmount = computed(() => {
  return localNovedades.value.reduce((sum, nov) => sum + (nov.montoAplicado || 0), 0);
});

const getParametroName = (idParametro: string) => {
  const param = parametros.value.find(p => p.iD_Parametro === idParametro);
  return param ? `${param.tipo} - ${param.descripcion}` : 'Desconocido';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

const closeModal = () => {
  console.log('Cerrando modal...');
  showAddModal.value = false;
};

const selectNovedad = async (novedad: Novedad) => {
  console.log('Seleccionando novedad:', novedad);

  const novedadNomina: NovedadNomina = {
    iD_Novedad: novedad.iD_Novedad || crypto.randomUUID(),
    iD_Parametro: novedad.iD_Parametro,
    fechaIngresada: novedad.fechaIngresada,
    tipoNovedad: novedad.tipoNovedad,
    descripcion: novedad.descripcion,
    montoAplicado: 0,
    is_Gravable: novedad.is_Gravable
  };

  localNovedades.value = [...localNovedades.value, novedadNomina];

  await nextTick();
  closeModal();
  console.log('Modal cerrado');
};

const removeNovedad = (index: number) => {
  localNovedades.value.splice(index, 1);
};

const reloadNovedades = async () => {
  await novedadStore.fetchAll();
  await parametroStore.fetchAll();
};

onMounted(async () => {
  if (parametros.value.length === 0) {
    await parametroStore.fetchAll();
  }
  if (novedades.value.length === 0) {
    await novedadStore.fetchAll();
  }
});
</script>
