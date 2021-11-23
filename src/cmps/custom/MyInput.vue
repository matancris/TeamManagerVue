<template>
  <div class="my-input group">
    <input
      :id="id"
      :type="type"
      :required="isRequired"
      :autofocus="isAutoFocus"
      :value="value"
      @input="handleInput"
    />
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    id: String,
    label: String,
    isRequired: {
      type: Boolean,
      default: true
    },
    isAutoFocus: Boolean,
    value: String,
  },
  data() {
    return {
      content: this.value,
    };
  },
  methods: {
    handleInput({ target }) {
      this.$emit('input', target.value);
    },
  },
};
</script>

<style>
</style>