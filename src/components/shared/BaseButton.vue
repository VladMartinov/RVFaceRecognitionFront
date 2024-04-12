<template>
  <button class="btn" @click="this.$emit('onClick', $event)">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BaseButton",
};
</script>

<style lang="scss" scoped>
.btn {
  padding: 9px 17px;
  width: fit-content;

  border-radius: 5px;

  font-size: 14px;
  font-weight: 400;
  color: $text-color;

  transition: background-color 0.1s ease-in, border-color 0.1s ease-in;

  border: 1px solid transparent;

  &:disabled {
    color: $text-disabled-color;
    cursor: default;
  }

  &.-primary {
    background-color: $primary-color;
    border-color: $primary-color;

    &:hover {
      background-color: $primary-hover-color;
      border-color: $primary-hover-color;
    }

    &:active,
    &.-active {
      background-color: $primary-active-color;
      border-color: $primary-active-color;
    }

    &:disabled {
      background-color: $primary-disabled-color;
      border-color: $primary-disabled-color;
    }
  }

  &.-secondary {
    background-color: $secondary-color;
    border-color: $border-color;

    &:hover {
      background-color: $secondary-hover-color;
      border-color: $border-hover-color;
    }

    &:active,
    &.-active {
      background-color: $secondary-active-color;
      border-color: $border-active-color;
    }

    &:disabled {
      background-color: $secondary-disabled-color;
      border-color: $border-disabled-color;
    }
  }

  &.-small,
  &.-icon {
    min-height: 35px;
    min-width: 40px;
  }

  &.-small {
    padding: 9px 8px;
  }

  &.-super-small {
    padding: 3px 30px;

    min-height: 24px;
    min-width: 140px;
  }

  &.-icon {
    padding: 6px 8px;
  }

  &.-full-width {
    width: 100%;
  }
}
</style>
