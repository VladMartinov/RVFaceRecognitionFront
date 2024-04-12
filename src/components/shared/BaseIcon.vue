<template>
  <svg :style="styles" :class="classes" @click="onClick">
    <use :xlink:href="xlinkHref" />
  </svg>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "16px",
    },
    color: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    xlinkHref() {
      return `#${this.name}`;
    },
    styles() {
      if (this.width && this.height) {
        return {
          width: this.width,
          height: this.height,
        };
      } else {
        return {
          width: this.size,
          height: this.size,
        };
      }
    },
    classes() {
      return {
        icon: true,
        [`text-${this.color}`]: !!this.color,
      };
    },
  },
  methods: {
    onClick($event) {
      this.$emit("onClick", $event);
    },
  },
};
</script>
