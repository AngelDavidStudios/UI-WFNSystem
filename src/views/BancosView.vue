<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">BANCOS</h1>
        <p class="text-blueprint-light">Gestión de Entidades Bancarias</p>
      </div>
      <BlueprintButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nuevo Banco
      </BlueprintButton>
    </div>

    <BlueprintCard>
      <div v-if="bancoStore.isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blueprint-primary mx-auto"></div>
        <p class="text-blueprint-light mt-4">Cargando bancos...</p>
      </div>

      <div v-else-if="bancoStore.bancos.length === 0" class="text-center py-12">
        <BuildingLibraryIcon class="h-16 w-16 text-blueprint-primary mx-auto mb-4" />
        <p class="text-blueprint-light">No hay bancos registrados</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-blueprint-border">
          <thead>
            <tr class="border-b border-blueprint-border">
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Banco</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Nº Cuenta</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Tipo</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">SWIFT</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">País</th>
              <th class="px-4 py-4 text-left text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Sucursal</th>
              <th class="px-4 py-4 text-right text-xs font-semibold text-blueprint-primary uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-blueprint-border/30">
            <tr
              v-for="banco in bancoStore.bancos"
              :key="banco.iD_Banking"
              class="hover:bg-blueprint-card/30 transition-colors"
            >
              <td class="px-4 py-4 whitespace-nowrap text-sm text-white">{{ banco.bankName }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">{{ banco.accountNumber }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">{{ banco.accountType }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">{{ banco.swiftCode }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">{{ banco.pais }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-blueprint-light">{{ banco.sucursal }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="openEditModal(banco)"
                  class="text-blueprint-primary hover:text-white transition-colors mr-3"
                  title="Editar"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="handleDelete(banco.iD_Banking!)"
                  class="text-red-400 hover:text-red-300 transition-colors"
                  title="Eliminar"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BlueprintCard>

    <BlueprintModal
      :show="isModalOpen"
      :title="isEditing ? 'Editar Banco' : 'Nuevo Banco'"
      @close="closeModal"
    >
      <BancoForm
        :banco="selectedBanco"
        :isEditing="isEditing"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
      <template #footer>
        <span></span>
      </template>
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBancoStore } from '@/stores/banco.store';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import BancoForm from '@/components/forms/BancoForm.vue';
import { BuildingLibraryIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Banco, BancoFormData } from '@/types';

const bancoStore = useBancoStore();
const isModalOpen = ref(false);
const isEditing = ref(false);
const selectedBanco = ref<Banco | null>(null);

onMounted(async () => {
  await bancoStore.fetchAll();
});

const openCreateModal = () => {
  isEditing.value = false;
  selectedBanco.value = null;
  isModalOpen.value = true;
};

const openEditModal = (banco: Banco) => {
  isEditing.value = true;
  selectedBanco.value = banco;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedBanco.value = null;
  isEditing.value = false;
};

const handleSubmit = async (formData: BancoFormData) => {
  let success = false;

  if (isEditing.value && selectedBanco.value?.iD_Banking) {
    success = await bancoStore.update(selectedBanco.value.iD_Banking, formData);
  } else {
    success = await bancoStore.create(formData);
  }

  if (success) {
    closeModal();
  }
};

const handleDelete = async (id: string) => {
  if (confirm('¿Está seguro de que desea eliminar este banco?')) {
    await bancoStore.remove(id);
  }
};
</script>
