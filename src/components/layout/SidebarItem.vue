<template>
  <div>
    <div
      v-if="!item.children"
      @click="navigateTo(item.path)"
      :class="[
        'px-4 py-3 cursor-pointer transition-all duration-300 border-l-2',
        isActive
          ? 'border-blueprint-primary bg-blueprint-primary/10 text-blueprint-primary'
          : 'border-transparent hover:border-blueprint-primary/50 hover:bg-white/5 text-white hover:text-blueprint-primary'
      ]"
    >
      <span class="text-sm font-medium uppercase tracking-wide">{{ item.label }}</span>
    </div>

    <div v-else>
      <div
        @click="toggleSubmenu"
        :class="[
          'px-4 py-3 cursor-pointer transition-all duration-300 border-l-2 flex items-center justify-between',
          hasActiveChild || isExpanded
            ? 'border-blueprint-primary bg-blueprint-primary/10 text-blueprint-primary'
            : 'border-transparent hover:border-blueprint-primary/50 hover:bg-white/5 text-white hover:text-blueprint-primary'
        ]"
      >
        <span class="text-sm font-medium uppercase tracking-wide">{{ item.label }}</span>
        <ChevronDownIcon
          :class="[
            'h-4 w-4 transition-transform duration-300',
            isExpanded ? 'rotate-180' : ''
          ]"
        />
      </div>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-show="isExpanded" class="overflow-hidden">
          <div class="ml-4 mt-1 space-y-1">
            <div
              v-for="child in item.children"
              :key="child.id"
              @click="navigateTo(child.path)"
              :class="[
                'px-4 py-2.5 cursor-pointer transition-all duration-300 border-l-2',
                isChildActive(child.path)
                  ? 'border-blueprint-primary bg-blueprint-primary/10 text-blueprint-primary'
                  : 'border-transparent hover:border-blueprint-primary/50 hover:bg-white/5 text-white/70 hover:text-blueprint-primary'
              ]"
            >
              <span class="text-xs font-medium uppercase tracking-wide">{{ child.label }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import type { MenuItem } from '@/types';

interface Props {
  item: MenuItem;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  navigate: [];
}>();

const router = useRouter();
const route = useRoute();

const isExpanded = ref(false);

const isActive = computed(() => route.path === props.item.path);

const hasActiveChild = computed(() => {
  if (!props.item.children) return false;
  return props.item.children.some((child: MenuItem) => route.path === child.path);
});

const isChildActive = (path: string) => route.path === path;

const toggleSubmenu = () => {
  isExpanded.value = !isExpanded.value;
};

const navigateTo = (path: string) => {
  if (path) {
    router.push(path);
    emit('navigate');
  }
};

if (hasActiveChild.value) {
  isExpanded.value = true;
}
</script>
