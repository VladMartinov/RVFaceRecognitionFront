<template>
  <div class="test">
    <h1>Hello! This is the test view!</h1>

    <p>Icon:</p>
    <div>
      <BaseIcon name="eye-close" size="28px" />
    </div>

    <p>Buttons:</p>
    <div class="buttons">
      <BaseButton class="-primary">Test prim button</BaseButton>
      <BaseButton class="-secondary">Test sec button</BaseButton>

      <BaseButton class="-primary" disabled>Test prim button</BaseButton>
      <BaseButton class="-secondary" disabled>Test sec button</BaseButton>

      <BaseButton class="-primary -small">1</BaseButton>
      <BaseButton class="-secondary -small">1</BaseButton>

      <BaseButton class="-primary -small" disabled>1</BaseButton>
      <BaseButton class="-secondary -small" disabled>1</BaseButton>

      <BaseButton class="-primary -icon">
        <BaseIcon name="dots" size="24px" />
      </BaseButton>
      <BaseButton class="-secondary -icon">
        <BaseIcon name="dots" size="24px" />
      </BaseButton>

      <BaseButton class="-primary -icon" disabled>
        <BaseIcon name="dots" size="24px" />
      </BaseButton>
      <BaseButton class="-secondary -icon" disabled>
        <BaseIcon name="dots" size="24px" />
      </BaseButton>
    </div>

    <p>Inputs:</p>
    <div class="inputs">
      <BaseInput
        type="text"
        placeholder="Test input"
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
      <BaseInput
        type="text"
        placeholder="Test input"
        disabled
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
      <BaseInput
        class="-error"
        type="text"
        placeholder="Test input"
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
      <BaseInput
        class="-error"
        type="text"
        placeholder="Test input"
        disabled
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />

      <BaseInput
        class="-search"
        type="text"
        placeholder="Test input"
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
      <BaseInput
        class="-search"
        type="text"
        placeholder="Test input"
        disabled
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
      <BaseInput
        class="-search -error"
        type="text"
        placeholder="Test input"
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
      <BaseInput
        class="-search -error"
        type="text"
        placeholder="Test input"
        disabled
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />

      <BaseInput
        class="-small"
        type="text"
        placeholder="Test input"
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
      <BaseInput
        class="-search -small"
        type="text"
        placeholder="Test input"
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
      <BaseInput
        class="-error -small"
        type="text"
        placeholder="Test input"
        :modelValue="inputValue"
        @update:modelValue="inputValue = $event"
      />
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "TestComponentsView",
  data() {
    return {
      inputValue: "Test",
    };
  },
};
</script>

<style lang="scss">
.test {
  padding: 50px;
  & > * {
    margin: 0 auto;
    width: fit-content;

    &.inputs,
    &.buttons {
      display: flex;
      flex-direction: column;
      align-items: center;

      row-gap: 10px;
    }

    &.inputs {
      width: 100%;
    }

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
</style>
