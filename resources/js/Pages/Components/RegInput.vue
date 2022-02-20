<!-- prettier-ignore -->
<template>
  <label class="block">
    <span class="text-gray-700">{{ label }}:</span>
    <input
      :type="type"
      :placeholder="placeholder"
      class="mt-1 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
    >
  </label>
</template>

<script>
export default {
  name: 'RegInput',
  props: {
    type: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Пук',
    },
    label: {
      type: String,
      default: 'Пук',
    },
  },
}
</script>

<style scoped></style>
