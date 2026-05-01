<template>
  <Toast position="center" group="order">
    <template #message="slotProps">
      <div class="flex flex-col items-start flex-auto">
        <div class="flex items-center gap-2">
          <span class="font-bold">
            {{ slotProps.message.severity === 'success' ? 'Order Placed' : 'Order Failed' }}
          </span>
        </div>
        <div class="font-medium text-lg my-4">{{ slotProps.message.summary }}</div>
      </div>
    </template>
  </Toast>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

function showSuccess(message: string) {
  toast.add({ severity: 'success', summary: message, group: 'order', life: 4000 });
}

function showError(message: string) {
  toast.add({ severity: 'error', summary: message, group: 'order', life: 4000 });
}

defineExpose({ showSuccess, showError });
</script>
