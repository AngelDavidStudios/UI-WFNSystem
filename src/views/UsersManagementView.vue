<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p class="mt-2 text-sm text-gray-600">Administra usuarios, roles y permisos del sistema</p>
      </div>

      <div class="mb-6">
        <BlueprintButton @click="showCreateUserModal = true">
          Crear Nuevo Usuario
        </BlueprintButton>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Usuarios del Sistema</h3>
        </div>

        <div v-if="rolesStore.isLoading" class="p-8 text-center">
          <p class="text-gray-500">Cargando usuarios...</p>
        </div>

        <div v-else-if="rolesStore.error" class="p-8 text-center">
          <p class="text-red-600">{{ rolesStore.error }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in rolesStore.users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="user.role" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-purple-100 text-purple-800': user.role.name === 'Admin',
                      'bg-blue-100 text-blue-800': user.role.name === 'Gerente',
                      'bg-green-100 text-green-800': user.role.name === 'Jefe'
                    }">
                    {{ user.role.name }}
                  </span>
                  <span v-else class="text-gray-400">Sin rol</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openEditUserModal(user)" class="text-blue-600 hover:text-blue-900 mr-4">
                    Editar Rol
                  </button>
                  <button @click="confirmDeleteUser(user)" class="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Roles</h2>
          <BlueprintButton @click="showCreateRoleModal = true">
            Crear Nuevo Rol
          </BlueprintButton>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="role in rolesStore.roles" :key="role.id" class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-2" :class="{
              'text-purple-700': role.name === 'Admin',
              'text-blue-700': role.name === 'Gerente',
              'text-green-700': role.name === 'Jefe'
            }">
              {{ role.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-4">{{ role.description }}</p>
            <div class="flex space-x-3">
              <button @click="openPermissionsModal(role)" class="text-sm text-blue-600 hover:text-blue-800">
                Ver Permisos
              </button>
              <button @click="openEditRoleModal(role)" class="text-sm text-green-600 hover:text-green-800">
                Editar
              </button>
              <button @click="confirmDeleteRole(role)" class="text-sm text-red-600 hover:text-red-800">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Permisos</h2>
          <BlueprintButton @click="showCreatePermissionModal = true">
            Crear Nuevo Permiso
          </BlueprintButton>
        </div>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurso
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="permission in rolesStore.permissions" :key="permission.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ permission.resource }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ permission.action }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ permission.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openEditPermissionModal(permission)" class="text-green-600 hover:text-green-900 mr-4">
                    Editar
                  </button>
                  <button @click="confirmDeletePermission(permission)" class="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <BlueprintModal v-if="showCreateUserModal" :show="showCreateUserModal" title="Crear Usuario" @close="showCreateUserModal = false">
      <UserForm @submit="handleCreateUser" @cancel="showCreateUserModal = false" />
    </BlueprintModal>

    <BlueprintModal v-if="showEditUserModal" :show="showEditUserModal" title="Editar Usuario" @close="showEditUserModal = false">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Editar Rol de Usuario</h3>
        <p class="text-sm text-gray-600 mb-4">Usuario: {{ selectedUser?.email }}</p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
          <select v-model="selectedRoleId" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Seleccionar rol</option>
            <option v-for="role in rolesStore.roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-3">
          <BlueprintButton @click="showEditUserModal = false" variant="secondary">
            Cancelar
          </BlueprintButton>
          <BlueprintButton @click="handleUpdateUserRole">
            Guardar
          </BlueprintButton>
        </div>
      </div>
    </BlueprintModal>

    <BlueprintModal v-if="showPermissionsModal" :show="showPermissionsModal" title="Gestionar Permisos del Rol" @close="showPermissionsModal = false">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Permisos de {{ selectedRole?.name }}</h3>

        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Agregar Permiso</h4>
          <div class="flex space-x-2">
            <select v-model="selectedPermissionId" class="flex-1 px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Seleccionar permiso</option>
              <option v-for="permission in availablePermissions" :key="permission.id" :value="permission.id">
                {{ permission.resource }} - {{ permission.action }}
              </option>
            </select>
            <BlueprintButton @click="handleAddPermission" :disabled="!selectedPermissionId">
              Agregar
            </BlueprintButton>
          </div>
        </div>

        <div v-if="rolePermissions.length > 0" class="space-y-2">
          <div v-for="permission in rolePermissions" :key="permission.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ permission.resource }}</p>
              <p class="text-xs text-gray-500">{{ permission.action }} - {{ permission.description }}</p>
            </div>
            <button @click="handleRemovePermission(permission.id)" class="text-red-600 hover:text-red-800">
              Remover
            </button>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">No hay permisos asignados</p>
        <div class="mt-6 flex justify-end">
          <BlueprintButton @click="showPermissionsModal = false">
            Cerrar
          </BlueprintButton>
        </div>
      </div>
    </BlueprintModal>

    <BlueprintModal v-if="showCreateRoleModal" :show="showCreateRoleModal" title="Crear Rol" @close="showCreateRoleModal = false">
      <RoleForm @submit="handleCreateRole" @cancel="showCreateRoleModal = false" />
    </BlueprintModal>

    <BlueprintModal v-if="showEditRoleModal" :show="showEditRoleModal" title="Editar Rol" @close="showEditRoleModal = false">
      <RoleForm :role="selectedRole || undefined" @submit="handleUpdateRole" @cancel="showEditRoleModal = false" />
    </BlueprintModal>

    <BlueprintModal v-if="showCreatePermissionModal" :show="showCreatePermissionModal" title="Crear Permiso" @close="showCreatePermissionModal = false">
      <PermissionForm @submit="handleCreatePermission" @cancel="showCreatePermissionModal = false" />
    </BlueprintModal>

    <BlueprintModal v-if="showEditPermissionModal" :show="showEditPermissionModal" title="Editar Permiso" @close="showEditPermissionModal = false">
      <PermissionForm :permission="selectedPermission || undefined" @submit="handleUpdatePermission" @cancel="showEditPermissionModal = false" />
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRolesStore } from '@/stores/roles.store';
import type { UserWithRole, Role, Permission, UserRegistration } from '@/types';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import UserForm from '@/components/forms/UserForm.vue';
import RoleForm from '@/components/forms/RoleForm.vue';
import PermissionForm from '@/components/forms/PermissionForm.vue';

const rolesStore = useRolesStore();

const showCreateUserModal = ref(false);
const showEditUserModal = ref(false);
const showPermissionsModal = ref(false);
const showCreateRoleModal = ref(false);
const showEditRoleModal = ref(false);
const showCreatePermissionModal = ref(false);
const showEditPermissionModal = ref(false);
const selectedUser = ref<UserWithRole | null>(null);
const selectedRole = ref<Role | null>(null);
const selectedPermission = ref<Permission | null>(null);
const selectedRoleId = ref('');
const selectedPermissionId = ref('');
const rolePermissions = ref<Permission[]>([]);

const availablePermissions = computed(() => {
  const assignedIds = rolePermissions.value.map(p => p.id);
  return rolesStore.permissions.filter(p => !assignedIds.includes(p.id));
});

onMounted(async () => {
  await rolesStore.loadRoles();
  await rolesStore.loadPermissions();
  await rolesStore.loadUsers();
});

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const handleCreateUser = async (registration: UserRegistration): Promise<void> => {
  const success = await rolesStore.createUser(registration);
  if (success) {
    showCreateUserModal.value = false;
  }
};

const openEditUserModal = (user: UserWithRole): void => {
  selectedUser.value = user;
  selectedRoleId.value = user.role?.id || '';
  showEditUserModal.value = true;
};

const handleUpdateUserRole = async (): Promise<void> => {
  if (!selectedUser.value || !selectedRoleId.value) return;

  const success = await rolesStore.updateUserRole(selectedUser.value.id, selectedRoleId.value);
  if (success) {
    showEditUserModal.value = false;
    selectedUser.value = null;
    selectedRoleId.value = '';
  }
};

const confirmDeleteUser = async (user: UserWithRole): Promise<void> => {
  if (confirm(`¿Está seguro de eliminar al usuario ${user.email}?`)) {
    await rolesStore.deleteUser(user.id);
  }
};

const openPermissionsModal = async (role: Role): Promise<void> => {
  selectedRole.value = role;
  rolePermissions.value = await rolesStore.getRolePermissions(role.id);
  selectedPermissionId.value = '';
  showPermissionsModal.value = true;
};

const handleAddPermission = async (): Promise<void> => {
  if (!selectedRole.value || !selectedPermissionId.value) return;

  const success = await rolesStore.assignRolePermission(selectedRole.value.id, selectedPermissionId.value);
  if (success) {
    rolePermissions.value = await rolesStore.getRolePermissions(selectedRole.value.id);
    selectedPermissionId.value = '';
  }
};

const handleRemovePermission = async (permissionId: string): Promise<void> => {
  if (!selectedRole.value) return;

  if (confirm('¿Está seguro de remover este permiso del rol?')) {
    const success = await rolesStore.removeRolePermission(selectedRole.value.id, permissionId);
    if (success) {
      rolePermissions.value = await rolesStore.getRolePermissions(selectedRole.value.id);
    }
  }
};

const handleCreateRole = async (data: { name: string; description: string }): Promise<void> => {
  const success = await rolesStore.createRole(data);
  if (success) {
    showCreateRoleModal.value = false;
  }
};

const openEditRoleModal = (role: Role): void => {
  selectedRole.value = role;
  showEditRoleModal.value = true;
};

const handleUpdateRole = async (data: { name: string; description: string }): Promise<void> => {
  if (!selectedRole.value) return;

  const success = await rolesStore.updateRole(selectedRole.value.id, data);
  if (success) {
    showEditRoleModal.value = false;
    selectedRole.value = null;
  }
};

const confirmDeleteRole = async (role: Role): Promise<void> => {
  if (confirm(`¿Está seguro de eliminar el rol ${role.name}?`)) {
    await rolesStore.deleteRole(role.id);
  }
};

const handleCreatePermission = async (data: { resource: string; action: string; description: string }): Promise<void> => {
  const success = await rolesStore.createPermission(data);
  if (success) {
    showCreatePermissionModal.value = false;
  }
};

const openEditPermissionModal = (permission: Permission): void => {
  selectedPermission.value = permission;
  showEditPermissionModal.value = true;
};

const handleUpdatePermission = async (data: { resource: string; action: string; description: string }): Promise<void> => {
  if (!selectedPermission.value) return;

  const success = await rolesStore.updatePermission(selectedPermission.value.id, data);
  if (success) {
    showEditPermissionModal.value = false;
    selectedPermission.value = null;
  }
};

const confirmDeletePermission = async (permission: Permission): Promise<void> => {
  if (confirm(`¿Está seguro de eliminar el permiso ${permission.resource}:${permission.action}?`)) {
    await rolesStore.deletePermission(permission.id);
  }
};
</script>
