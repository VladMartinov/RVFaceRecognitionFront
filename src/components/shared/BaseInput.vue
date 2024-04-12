<template>
  <div class="input">
    <input
      class="input-field"
      :class="{ '-show-icon': showClearIcon }"
      v-bind="$attrs"
      v-model="value"
      :disabled="disabled"
      @update.stop=""
    />
    <div class="input-icons">
      <BaseIcon
        name="clear"
        size="16px"
        color="transparent"
        v-if="showClearIcon"
        @click="value = ''"
      />
      <BaseIcon
        name="search"
        size="24px"
        @click="!disabled && $emit('search', $event)"
      />
    </div>
  </div>
</template>

<script>
import { useModelWrapper } from "@/utils/modelWrapper";

export default {
  inheritAttrs: false,
  name: "BaseInput",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onUpdate: {
      default: () => {
        return;
      },
    },
  },
  setup(props, { emit }) {
    return {
      value: useModelWrapper(props, emit, "modelValue"),
    };
  },
  computed: {
    showClearIcon() {
      return this.value && !this.disabled;
    },
  },
};
</script>

<style lang="scss" scoped>
.input {
  position: relative;

  width: 100%;
  height: 100%;

  color: $text-color;
}

.input-field {
  padding: 12px;

  width: 100%;
  height: 100%;
  min-height: 42px;

  border: 1px solid $grey-light-color;
  border-radius: 4px;
  background-color: transparent;

  font-size: 14px;
  color: inherit;

  transition: background-color 0.1s ease-in, border-color 0.1s ease-in;

  &::placeholder {
    color: $text-placeholder-color;
  }

  &:-webkit-autofill {
    border-color: $grey-light-color;
    -webkit-text-fill-color: $text-color;
    -webkit-box-shadow: 0 0 0px 100px transparent inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  &:hover:not(:disabled) {
    border-color: $white;
    background-color: rgba($primary-hover-color, 0.15);
  }

  &:active:not(:disabled),
  &:focus:not(:disabled) {
    border-color: $primary-hover-color;
    background-color: transparent;
  }

  &.-error,
  &:hover.-error,
  &:active.-error,
  &:focus.-error,
  &:disabled.-error {
    border-color: $error-color;
  }

  &:disabled {
    border-color: $border-disabled-color;
    background-color: transparent;

    &,
    &::placeholder,
    & + .input-icons > * {
      color: $text-disabled-color;
    }

    & + .input-icons > * {
      cursor: default;
    }
  }

  &.-search {
    padding-right: 40px;

    &.-show-icon {
      padding-right: 64px;
    }

    & + .input-icons {
      display: flex;
    }
  }

  &.-small {
    padding: 6px 12px;

    min-height: 32px;

    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-radius: 0;

    & + .input-icons {
      right: 8px;
      top: 4px;
    }
  }
}

.input-icons {
  position: absolute;

  right: 9px;
  top: 9px;

  display: none;
  align-items: center;
  flex-shrink: 0;

  column-gap: 8px;

  & > * {
    flex-shrink: 0;

    cursor: pointer;

    &.text-transparent {
      color: rgba($text-color, 0.5);
    }
  }
}
</style>
