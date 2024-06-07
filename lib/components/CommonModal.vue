<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  persistent: {
    type: Boolean,
    default: false
  },
  notEscapable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const modalRef = ref(null)

function closeModal() {
  emit('close')
}

function clickOutside() {
  if (!props.persistent) {
    closeModal()
  }
}

function closeWithEsc() {
  if (!props.notEscapable && !props.persistent) {
    closeModal()
  }
}

onMounted(() => {
  if (modalRef.value) {
    modalRef.value.focus()
  }
})
</script>

<template>
  <div class="settings-modal__overlay"></div>
  <div
    ref="modalRef"
    @click.self="clickOutside"
    @keyup.esc="closeWithEsc"
    class="settings-modal"
  >
    <div class="settings-modal__component">
      <div class="settings-modal__header">
        <slot name="header"></slot>
        <button
          v-if="!persistent"
          type="button"
          @click="closeModal"
          class="settings-modal__close-btn"
        >
        <svg
          style="width: 1.25rem; height: 1.25rem;"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        ><path
          clip-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          fill-rule="evenodd"
        /></svg>
        </button>
      </div>
      <div class="settings-modal__body">
      <slot></slot>
      </div>
      <div v-if="$slots.footer" class="settings-modal__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-modal__overlay {
  position: fixed;
  inset: 0;
  background-color: #000000;
  opacity: 0.5;
  z-index: 40;
}
.settings-modal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 50;
}
.settings-modal__component {
  position: relative;
  border-radius: 0.5rem;
  opacity: 1;
  background-color: var(--dark-app-color);
}
.settings-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--main-app-color);
  padding: 1rem;
}
.settings-modal__close-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  border-radius: 0.5rem;
  background-color: transparent;
  padding: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: pointer;
  color: var(--main-app-color);
}
.settings-modal__close-btn:hover {
  color: #fff;
  background-color: var(--main-app-color);
}
.settings-modal__body {
  padding: 1.5rem;
}
.settings-modal__footer {
  border-top: 1px solid var(--main-app-color);
  padding: 1.5rem;
}
</style>