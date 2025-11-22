<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-blueprint-primary text-shadow-glow mb-2">GESTIÓN DE USUARIOS</h1>
      <p class="text-blueprint-light">Administración de usuarios y roles del sistema</p>
    </div>

    <div class="mb-6 flex justify-between items-center">
      <BlueprintButton @click="showCreateModal = true" icon="plus">
        Crear Usuario
      </BlueprintButton>
    </div>

    <div v-if="userStore.isLoading" class="text-center py-12">
      <p class="text-blueprint-light">Cargando usuarios...</p>
    </div>

    <div v-else-if="userStore.users.length === 0" class="text-center py-12">
      <p class="text-blueprint-light/60">No hay usuarios registrados</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <BlueprintCard v-for="user in userStore.users" :key="user.id">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-blueprint-primary mb-2">{{ user.email }}</h3>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="role in user.roles"
                :key="role.id"
                class="px-3 py-1 rounded bg-blueprint-primary/20 text-blueprint-primary text-sm"
              >
                {{ role.name }}
              </span>
            </div>
            <p class="text-blueprint-light/60 text-sm">
              Creado: {{ new Date(user.created_at).toLocaleDateString('es-ES') }}
            </p>
          </div>
          <div class="flex gap-2">
            <BlueprintButton @click="editUser(user)" variant="secondary" size="sm">
              Editar Roles
            </BlueprintButton>
            <button
              @click="confirmDelete(user)"
              class="p-2 text-red-400 hover:text-red-300 transition-colors"
              v-if="user.id !== authStore.user?.id"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </BlueprintCard>
    </div>

    <BlueprintModal :show="showCreateModal" @close="showCreateModal = false" title="Crear Usuario">
      <form @submit.prevent="handleCreate" class="space-y-4">
        <BlueprintInput
          v-model="createForm.email"
          label="Email"
          type="email"
          required
        />
        <BlueprintInput
          v-model="createForm.password"
          label="Contraseña"
          type="password"
          required
        />
        <div>
          <label class="block text-sm font-medium text-blueprint-light mb-2">Rol</label>
          <select
            v-model="createForm.roleId"
            class="w-full px-4 py-2 bg-blueprint-dark/50 border border-blueprint-primary/30 rounded text-white focus:outline-none focus:border-blueprint-primary"
            required
          >
            <option value="">Seleccione un rol</option>
            <option v-for="role in roleStore.roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </form>
      <template #footer>
        <BlueprintButton variant="secondary" @click="showCreateModal = false">
          Cancelar
        </BlueprintButton>
        <BlueprintButton @click="handleCreate">
          Crear
        </BlueprintButton>
      </template>
    </BlueprintModal>

    <BlueprintModal :show="showEditModal" @close="showEditModal = false" title="Editar Roles de Usuario">
      <div class="space-y-4">
        <p class="text-blueprint-light">{{ selectedUser?.email }}</p>
        <div class="space-y-2">
          <label
            v-for="role in roleStore.roles"
            :key="role.id"
            class="flex items-center gap-3 p-3 border border-blueprint-primary/30 rounded cursor-pointer hover:bg-blueprint-primary/10"
          >
            <input
              type="checkbox"
              :value="role.id"
              v-model="editForm.roleIds"
              class="w-4 h-4"
            />
            <div>
              <p class="text-white font-semibold">{{ role.name }}</p>
              <p class="text-blueprint-light/60 text-sm">{{ role.description }}</p>
            </div>
          </label>
        </div>
      </div>
      <template #footer>
        <BlueprintButton variant="secondary" @click="showEditModal = false">
          Cancelar
        </BlueprintButton>
        <BlueprintButton @click="handleEdit">
          Guardar
        </BlueprintButton>
      </template>
    </BlueprintModal>

    <BlueprintModal :show="showDeleteModal" @close="showDeleteModal = false" title="Eliminar Usuario">
      <p class="text-blueprint-light mb-6">
        ¿Está seguro que desea eliminar el usuario <strong class="text-white">{{ selectedUser?.email }}</strong>?
        Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <BlueprintButton variant="secondary" @click="showDeleteModal = false">
          Cancelar
        </BlueprintButton>
        <BlueprintButton @click="handleDelete" class="!bg-red-500 hover:!bg-red-600">
          Eliminar
        </BlueprintButton>
      </template>
    </BlueprintModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline';
import BlueprintCard from '@/components/common/BlueprintCard.vue';
import BlueprintButton from '@/components/common/BlueprintButton.vue';
import BlueprintInput from '@/components/common/BlueprintInput.vue';
import BlueprintModal from '@/components/common/BlueprintModal.vue';
import { useUserManagementStore } from '@/stores/user-management.store';
import { useRoleStore } from '@/stores/role.store';
import { useAuthStore } from '@/stores/auth.store';
import type { SystemUser } from '@/services/user-management.facade';

const userStore = useUserManagementStore();
const roleStore = useRoleStore();
const authStore = useAuthStore();

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedUser = ref<SystemUser | null>(null);

const createForm = ref({
  email: '',
  password: '',
  roleId: '',
});

const editForm = ref({
  roleIds: [] as string[],
});

const editUser = (user: SystemUser) => {
  selectedUser.value = user;
  editForm.value.roleIds = user.roles.map(r => r.id);
  showEditModal.value = true;
};

const confirmDelete = (user: SystemUser) => {
  selectedUser.value = user;
  showDeleteModal.value = true;
};

const handleCreate = async () => {
  const success = await userStore.createUser(createForm.value);
  if (success) {
    showCreateModal.value = false;
    createForm.value = { email: '', password: '', roleId: '' };
  }
};

const handleEdit = async () => {
  if (selectedUser.value) {
    const success = await userStore.updateUserRoles(
      selectedUser.value.id,
      editForm.value.roleIds
    );
    if (success) {
      showEditModal.value = false;
      selectedUser.value = null;
    }
  }
};

const handleDelete = async () => {
  if (selectedUser.value) {
    const success = await userStore.deleteUser(selectedUser.value.id);
    if (success) {
      showDeleteModal.value = false;
      selectedUser.value = null;
    }
  }
};

onMounted(async () => {
  await Promise.all([
    userStore.fetchUsers(),
    roleStore.fetchRoles(),
  ]);
});
</script>
