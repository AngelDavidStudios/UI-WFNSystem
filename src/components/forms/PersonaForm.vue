<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BlueprintInput
        id="dni"
        v-model="formData.dni"
        label="DNI"
        placeholder="Ingrese DNI"
        required
      />

      <div class="w-full">
        <label for="gender" class="block text-sm font-medium text-blueprint-light mb-2">
          GÉNERO
        </label>
        <select
          id="gender"
          v-model="formData.gender"
          required
          class="blueprint-input w-full px-4 py-2.5 text-sm"
        >
          <option value="">Seleccione género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <BlueprintInput
        id="primerNombre"
        v-model="formData.primerNombre"
        label="PRIMER NOMBRE"
        placeholder="Ingrese primer nombre"
        required
      />

      <BlueprintInput
        id="segundoNombre"
        v-model="formData.segundoNombre"
        label="SEGUNDO NOMBRE"
        placeholder="Ingrese segundo nombre"
      />

      <BlueprintInput
        id="apellidoPaterno"
        v-model="formData.apellidoPaterno"
        label="APELLIDO PATERNO"
        placeholder="Ingrese apellido paterno"
        required
      />

      <BlueprintInput
        id="apellidoMaterno"
        v-model="formData.apellidoMaterno"
        label="APELLIDO MATERNO"
        placeholder="Ingrese apellido materno"
        required
      />

      <BlueprintInput
        id="dateBirthday"
        v-model="formData.dateBirthday"
        type="date"
        label="FECHA DE NACIMIENTO"
        required
      />

      <div class="w-full">
        <label for="edad" class="block text-sm font-medium text-blueprint-light mb-2">
          EDAD
        </label>
        <input
          id="edad"
          v-model.number="formData.edad"
          type="number"
          class="blueprint-input w-full px-4 py-2.5 text-sm"
          placeholder="Ingrese edad"
          required
        />
      </div>
    </div>

    <div class="border-t border-white/20 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-blueprint-primary uppercase">Correos Electrónicos</h3>
        <button
          type="button"
          @click="addCorreo"
          class="text-blueprint-primary hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <PlusIcon class="h-4 w-4" />
          Agregar Correo
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="(_correo, index) in formData.correo"
          :key="index"
          class="flex gap-2"
        >
          <BlueprintInput
            :id="`correo-${index}`"
            v-model="formData.correo[index]"
            type="email"
            placeholder="correo@ejemplo.com"
            class="flex-1"
          />
          <button
            v-if="formData.correo.length > 1"
            type="button"
            @click="removeCorreo(index)"
            class="text-red-400 hover:text-red-300 transition-colors px-3"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <div class="border-t border-white/20 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-blueprint-primary uppercase">Teléfonos</h3>
        <button
          type="button"
          @click="addTelefono"
          class="text-blueprint-primary hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <PlusIcon class="h-4 w-4" />
          Agregar Teléfono
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="(_telefono, index) in formData.telefono"
          :key="index"
          class="flex gap-2"
        >
          <BlueprintInput
            :id="`telefono-${index}`"
            v-model="formData.telefono[index]"
            type="tel"
            placeholder="999999999"
            class="flex-1"
          />
          <button
            v-if="formData.telefono.length > 1"
            type="button"
            @click="removeTelefono(index)"
            class="text-red-400 hover:text-red-300 transition-colors px-3"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <div class="border-t border-white/20 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-blueprint-primary uppercase">Direcciones</h3>
        <button
          type="button"
          @click="addDireccion"
          class="text-blueprint-primary hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <PlusIcon class="h-4 w-4" />
          Agregar Dirección
        </button>
      </div>
      <div class="space-y-4">
        <div
          v-for="(_direccion, index) in formData.direcciones"
          :key="index"
          class="blueprint-card p-4 relative"
        >
          <button
            v-if="formData.direcciones.length > 1"
            type="button"
            @click="removeDireccion(index)"
            class="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <BlueprintInput
              :id="`calle-${index}`"
              v-model="formData.direcciones[index].calle"
              label="CALLE"
              placeholder="Ingrese calle"
              required
            />
            <BlueprintInput
              :id="`numero-${index}`"
              v-model="formData.direcciones[index].numero"
              label="NÚMERO"
              placeholder="Ingrese número"
              required
            />
            <BlueprintInput
              :id="`piso-${index}`"
              v-model="formData.direcciones[index].piso"
              label="PISO"
              placeholder="Ingrese piso"
              required
            />
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import type { PersonaFormData, Persona } from '@/types';

interface Props {
  persona?: Persona | null;
  modelValue: PersonaFormData;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: PersonaFormData];
  submit: [];
}>();

const formData = ref<PersonaFormData>({ ...props.modelValue });

watch(() => props.persona, (newPersona) => {
  if (newPersona) {
    console.log('=== PERSONA FORM INIT ===');
    console.log('Persona direcciones:', JSON.stringify(newPersona.direcciones, null, 2));

    const mappedDirecciones = newPersona.direcciones.map(d => ({ ...d }));
    console.log('Mapped direcciones:', JSON.stringify(mappedDirecciones, null, 2));

    formData.value = {
      dni: newPersona.dni,
      gender: newPersona.gender,
      primerNombre: newPersona.primerNombre,
      segundoNombre: newPersona.segundoNombre,
      apellidoMaterno: newPersona.apellidoMaterno,
      apellidoPaterno: newPersona.apellidoPaterno,
      dateBirthday: newPersona.dateBirthday,
      edad: newPersona.edad,
      correo: [...newPersona.correo],
      telefono: [...newPersona.telefono],
      direcciones: mappedDirecciones,
    };
  }
}, { immediate: true });

watch(formData, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

const addCorreo = () => {
  formData.value.correo.push('');
};

const removeCorreo = (index: number) => {
  formData.value.correo.splice(index, 1);
};

const addTelefono = () => {
  formData.value.telefono.push('');
};

const removeTelefono = (index: number) => {
  formData.value.telefono.splice(index, 1);
};

const addDireccion = () => {
  formData.value.direcciones.push({
    calle: '',
    numero: '',
    piso: '',
  });
};

const removeDireccion = (index: number) => {
  formData.value.direcciones.splice(index, 1);
};

const handleSubmit = () => {
  emit('submit');
};
</script>
