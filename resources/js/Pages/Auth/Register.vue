<!-- prettier-ignore -->
<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <p class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Зарегистрируйте аккаунт
        </p>
        <p class="mt-2 text-center text-sm text-gray-600">
          Или
          <a
            :href="authRoute"
            class="font-medium text-green-600 hover:text-green-500"
          >войдите</a>
          в существующий
        </p>
      </div>
      <form
        class="mt-8 space-y-6"
        @submit.prevent="submit()"
      >
        <div>
          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="aboba@example.com"
            >
            <button
              type="submit"
              class="mt-5 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
            >
              Продолжить
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { stardust } from '@eidellev/adonis-stardust'
import RegInput from '../Components/RegInput'

export default {
  name: 'Register',
  data() {
    return {
      form: this.$inertia.form({
        email: '',
      }),
      authRoute: stardust.route('auth.login.show'),
      regRoute: stardust.route('auth.register.store'),
    }
  },
  methods: {
    submit() {
      this.form.post(this.regRoute)
    },
  },
}
</script>

<style scoped></style>
