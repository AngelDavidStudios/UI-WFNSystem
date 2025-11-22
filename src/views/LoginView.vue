<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-blueprint-bg bg-blueprint-grid">
    <div class="w-full max-w-6xl mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div class="hidden lg:flex items-center justify-center">
          <div class="blueprint-card p-8 w-full h-[500px] flex items-center justify-center">
            <div class="text-center">
              <div class="w-64 h-64 mx-auto border-2 border-blueprint-primary rounded-lg flex items-center justify-center mb-6 blueprint-glow">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-blueprint-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-blueprint-primary mb-2 text-shadow-glow">SISTEMA BLUEPRINT</h2>
              <p class="text-blueprint-light">Administración Técnica</p>
            </div>
          </div>
        </div>

        <div class="w-full">
          <BlueprintCard>
            <div class="max-w-md mx-auto">
              <h1 class="text-3xl font-bold text-blueprint-primary mb-2 text-shadow-glow text-center">ACCESO</h1>
              <p class="text-blueprint-light text-center mb-8">Ingrese sus credenciales</p>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <BlueprintInput
                  id="email"
                  v-model="credentials.email"
                  type="email"
                  label="EMAIL"
                  placeholder="Ingrese su email"
                  required
                />

                <BlueprintInput
                  id="password"
                  v-model="credentials.password"
                  type="password"
                  label="CONTRASEÑA"
                  placeholder="Ingrese contraseña"
                  required
                />

                <div v-if="error" class="text-red-400 text-sm border border-red-400/30 bg-red-400/10 p-3">
                  {{ error }}
                </div>

                <BlueprintButton
                  type="submit"
                  :disabled="isLoading"
                  class="w-full"
                >
                  {{ isLoading ? 'ACCEDIENDO...' : 'INGRESAR' }}
                </BlueprintButton>
              </form>

              <div class="mt-6 text-center text-xs text-blueprint-light/50">
                <p>Use sus credenciales de Supabase</p>
              </div>
            </div>
          </BlueprintCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintCard from '@/components/common/BlueprintCard.vue';

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  email: '',
  password: '',
});

const error = ref<string | null>(null);
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = null;
  isLoading.value = true;

  const success = await authStore.login(credentials.value);

  if (success) {
    router.push('/dashboard');
  } else {
    error.value = authStore.error || 'Credenciales inválidas';
  }

  isLoading.value = false;
};
</script>
