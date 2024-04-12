<template>
  <div class="button-dropdown">
    <BaseButton class="-primary -icon" @onClick="changeState">
      <BaseIcon name="dots" size="24px" />
    </BaseButton>

    <div class="button-dropdown-list" :class="{ '-open': state }">
      <button
        v-for="(action, index) in actionsList"
        :key="index"
        :class="action.type"
        type="button"
        @click="selectAction(index)"
      >
        {{ action.text }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "BaseDropdown",
  props: {
    actionsList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const state = ref(false);

    const changeState = function () {
      state.value = !state.value;
    };

    const selectAction = function (id) {
      changeState();
      emit("selectAction", id);
    };

    return {
      state,

      changeState,
      selectAction,
    };
  },
};
</script>

<style lang="scss" scoped>
.button-dropdown {
  position: relative;
  width: fit-content;

  &-list {
    position: absolute;

    top: 105%;
    right: 0;

    display: none;

    background-color: $primary-color;
    border-radius: 5px;

    &.-open {
      display: block;
    }

    & > * {
      padding: 5px 10px;

      width: 100%;

      font-size: 14px;
      color: $text-color;

      transition: background-color 0.1s ease-in;

      &:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }

      &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }

      &:hover {
        background-color: $primary-hover-color;
      }

      &.-danger:hover {
        background-color: rgba($error-color, 0.5);
      }
    }
  }
}
</style>
