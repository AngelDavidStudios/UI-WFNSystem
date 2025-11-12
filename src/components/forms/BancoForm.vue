<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BlueprintInput
        v-model="formData.bankName"
        label="Nombre del Banco"
        placeholder="Ingrese el nombre del banco"
        required
      />

      <BlueprintInput
        v-model="formData.accountNumber"
        label="Número de Cuenta"
        placeholder="Ingrese el número de cuenta"
        required
      />

      <BlueprintInput
        v-model="formData.accountType"
        label="Tipo de Cuenta"
        placeholder="Ej: Ahorros, Corriente"
        required
      />

      <BlueprintInput
        v-model="formData.swiftCode"
        label="Código SWIFT"
        placeholder="Ingrese el código SWIFT"
        required
      />

      <BlueprintInput
        v-model="formData.pais"
        label="País"
        placeholder="Ingrese el país"
        required
      />

      <BlueprintInput
        v-model="formData.sucursal"
        label="Sucursal"
        placeholder="Ingrese la sucursal"
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
import type { Banco, BancoFormData } from '@/types';

interface Props {
  banco?: Banco | null;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  banco: null,
  isEditing: false
});

const emit = defineEmits<{
  submit: [data: BancoFormData];
  cancel: [];
}>();

const formData = ref<BancoFormData>({
  bankName: '',
  accountNumber: '',
  accountType: '',
  swiftCode: '',
  pais: '',
  sucursal: ''
});

watch(
  () => props.banco,
  (newBanco) => {
    if (newBanco) {
      formData.value = {
        bankName: newBanco.bankName || '',
        accountNumber: newBanco.accountNumber || '',
        accountType: newBanco.accountType || '',
        swiftCode: newBanco.swiftCode || '',
        pais: newBanco.pais || '',
        sucursal: newBanco.sucursal || ''
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
