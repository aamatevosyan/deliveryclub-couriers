<!-- prettier-ignore -->
<template>
  <div class="p-10 lg:flex lg:items-center lg:justify-between">
    <div class="flex-1 min-w-0">
      <p
        class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl selection:bg-fuchsia-300 select-none"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
    <div class="mt-5 flex lg:mt-0 lg:ml-6">
      <HomeButton
        :href="regRoute"
        text="Регистрация"
        class="text-white bg-green-500 hover:bg-green-600"
      />
      <HomeButton
        :href="authRoute"
        text="Авторизация"
        class="ml-6 text-green-600 bg-white hover:bg-green-50"
      />
    </div>
  </div>
</template>

<script>
import { stardust } from '@eidellev/adonis-stardust'
import HomeButton from './Components/HomeButton'

export default {
  name: 'Home',
  components: { HomeButton },
  computed: {
    regRoute() {
      return stardust.route('auth.register.create')
    },
    authRoute() {
      return stardust.route('auth.login.show')
    },
  },
}
</script>

<style scoped></style>
