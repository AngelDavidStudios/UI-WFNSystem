<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">DASHBOARD</h1>
      <p class="text-blueprint-light">Panel de Control Principal</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlueprintCard class="blueprint-glow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blueprint-light text-sm uppercase tracking-wide mb-1">Total Personas</p>
            <h3 class="text-3xl font-bold text-white">0</h3>
          </div>
          <div class="w-12 h-12 border-2 border-blueprint-primary flex items-center justify-center">
            <UsersIcon class="h-6 w-6 text-blueprint-primary" />
          </div>
        </div>
      </BlueprintCard>

      <BlueprintCard class="blueprint-glow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blueprint-light text-sm uppercase tracking-wide mb-1">Departamentos</p>
            <h3 class="text-3xl font-bold text-white">0</h3>
          </div>
          <div class="w-12 h-12 border-2 border-blueprint-primary flex items-center justify-center">
            <BuildingOfficeIcon class="h-6 w-6 text-blueprint-primary" />
          </div>
        </div>
      </BlueprintCard>

      <BlueprintCard class="blueprint-glow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blueprint-light text-sm uppercase tracking-wide mb-1">Empleados</p>
            <h3 class="text-3xl font-bold text-white">0</h3>
          </div>
          <div class="w-12 h-12 border-2 border-blueprint-primary flex items-center justify-center">
            <UserGroupIcon class="h-6 w-6 text-blueprint-primary" />
          </div>
        </div>
      </BlueprintCard>
    </div>

    <div class="mt-8">
      <BlueprintCard>
        <h2 class="text-xl font-bold text-blueprint-primary mb-4">Sistema Blueprint Activo</h2>
        <div class="space-y-3 text-blueprint-light">
          <p class="flex items-center gap-2">
            <span class="w-2 h-2 bg-blueprint-primary rounded-full animate-pulse"></span>
            Sistema operativo
          </p>
          <p class="flex items-center gap-2">
            <span class="w-2 h-2 bg-blueprint-primary rounded-full animate-pulse"></span>
            Base de datos conectada
          </p>
          <p class="flex items-center gap-2">
            <span class="w-2 h-2 bg-blueprint-primary rounded-full animate-pulse"></span>
            Todos los módulos disponibles
          </p>
        </div>
      </BlueprintCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import { UsersIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/vue/24/outline';
</script>
