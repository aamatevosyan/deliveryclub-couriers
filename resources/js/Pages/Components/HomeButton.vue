<!-- prettier-ignore -->
<template>
  <div class="inline-flex rounded-md shadow">
    <a
      :href="href"
      class="px-5 py-3 font-bold text-center rounded-md select-none"
    >
      {{ text }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'HomeButton',
  props: {
    text: {
      type: String,
      default: 'Тык',
    },
    href: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped></style>
