<template>
  <div v-if="state" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header"></slot>
          <button
            type="button"
            class="btn-close"
            @click="CloseModal()"
            aria-label="Закрыть"
          >
            <BaseIcon name="clear" size="20px" />
          </button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs } from "vue";

export default {
  name: "BaseModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = toRefs(props).visible;

    const CloseModal = function () {
      emit("closeModal");
    };

    return {
      state,

      CloseModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;

  top: 0;
  left: 0;
  z-index: 1060;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background-color: rgba($black, 0.5);

  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;

  &-dialog {
    position: relative;
    width: auto;
    max-width: 680px;
    min-width: 500px;
    pointer-events: none;
  }

  &-content {
    position: relative;

    display: flex;
    flex-direction: column;

    width: 100%;

    pointer-events: auto;

    background-color: $nav-hover-color;
    background-clip: padding-box;
    border: 1px solid $primary-color;
    border-radius: 0.3rem;

    text-align: start;

    outline: 0;
  }

  &-header {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;

    padding: 1rem 1rem;

    border-bottom: 1px solid $primary-color;
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);

    .icon {
      color: $white;
    }

    h5 {
      font-size: 20px;
    }
  }

  &-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem;
  }

  &-footer {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-end;
    padding: 0.75rem;
    border-top: 1px solid $primary-color;
    border-bottom-right-radius: calc(0.3rem - 1px);
    border-bottom-left-radius: calc(0.3rem - 1px);
  }
}
</style>
