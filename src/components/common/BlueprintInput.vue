<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-blueprint-light mb-2">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
      class="blueprint-input w-full px-4 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string;
  type?: string;
  label?: string;
  modelValue?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>
