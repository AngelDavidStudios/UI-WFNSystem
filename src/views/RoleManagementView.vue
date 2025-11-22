<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">GESTIÓN DE ROLES Y PERMISOS</h1>
      <p class="text-blueprint-light">Administración de roles y permisos del sistema</p>
    </div>

    <div v-if="roleStore.isLoading" class="text-center py-12">
      <p class="text-blueprint-light">Cargando roles...</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <BlueprintCard v-for="role in roleStore.roles" :key="role.id">
        <div class="mb-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-xl font-bold text-blueprint-primary">{{ role.name }}</h3>
              <p class="text-blueprint-light/60 text-sm">{{ role.description }}</p>
            </div>
            <BlueprintButton @click="editRolePermissions(role)" variant="secondary" size="sm">
              Editar Permisos
            </BlueprintButton>
          </div>
        </div>

        <div class="border-t border-blueprint-primary/20 pt-4">
          <h4 class="text-sm font-semibold text-blueprint-light mb-3">Permisos asignados:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div
              v-for="perm in getRolePermissionsDisplay(role.id)"
              :key="`${perm.resource}-${perm.action}`"
              class="px-3 py-2 bg-blueprint-primary/10 border border-blueprint-primary/30 rounded text-sm"
            >
              <span class="text-blueprint-primary font-semibold">{{ perm.resource }}</span>
              <span class="text-blueprint-light/60"> - {{ perm.action }}</span>
            </div>
          </div>
        </div>
      </BlueprintCard>
    </div>

    <BlueprintModal :show="showEditModal" @close="showEditModal = false" title="Editar Permisos del Rol" size="large">
      <div v-if="selectedRole" class="space-y-4">
        <p class="text-lg font-semibold text-blueprint-primary">{{ selectedRole.name }}</p>

        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div v-for="resource in groupedPermissions" :key="resource.name" class="border border-blueprint-primary/30 rounded p-4">
            <h5 class="font-semibold text-white mb-3">{{ resource.name }}</h5>
            <div class="grid grid-cols-2 gap-2">
              <label
                v-for="permission in resource.permissions"
                :key="permission.id"
                class="flex items-center gap-2 p-2 hover:bg-blueprint-primary/10 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="permission.id"
                  v-model="editForm.permissionIds"
                  class="w-4 h-4"
                />
                <span class="text-blueprint-light text-sm">{{ permission.action }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <BlueprintButton variant="secondary" @click="showEditModal = false">
          Cancelar
        </BlueprintButton>
        <BlueprintButton @click="handleEditPermissions">
          Guardar
        </BlueprintButton>
      </template>
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import { useRoleStore } from '@/stores/role.store';
import type { Role, Permission } from '@/services/role.facade';

const roleStore = useRoleStore();

const showEditModal = ref(false);
const selectedRole = ref<Role | null>(null);
const rolePermissions = ref<Map<string, Permission[]>>(new Map());

const editForm = ref({
  permissionIds: [] as string[],
});

const groupedPermissions = computed(() => {
  const groups = new Map<string, Permission[]>();

  roleStore.permissions.forEach(perm => {
    if (!groups.has(perm.resource)) {
      groups.set(perm.resource, []);
    }
    groups.get(perm.resource)!.push(perm);
  });

  return Array.from(groups.entries()).map(([name, permissions]) => ({
    name,
    permissions,
  }));
});

const getRolePermissionsDisplay = (roleId: string): Permission[] => {
  return rolePermissions.value.get(roleId) || [];
};

const editRolePermissions = async (role: Role) => {
  selectedRole.value = role;
  const perms = await roleStore.getRolePermissions(role.id);
  editForm.value.permissionIds = perms.map(p => p.id);
  showEditModal.value = true;
};

const handleEditPermissions = async () => {
  if (selectedRole.value) {
    const success = await roleStore.updateRolePermissions(
      selectedRole.value.id,
      editForm.value.permissionIds
    );
    if (success) {
      await loadRolePermissions();
      showEditModal.value = false;
      selectedRole.value = null;
    }
  }
};

const loadRolePermissions = async () => {
  for (const role of roleStore.roles) {
    const perms = await roleStore.getRolePermissions(role.id);
    rolePermissions.value.set(role.id, perms);
  }
};

onMounted(async () => {
  await roleStore.fetchRoles();
  await roleStore.fetchPermissions();
  await loadRolePermissions();
});
</script>
