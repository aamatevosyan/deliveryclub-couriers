export default {
  auth: {
    email: {
      timeouts: {
        resend: 5 * 60 * 1000, // ms
        code: 24 * 60 * 60 * 1000, // ms
      },
    },
    phone: {
      timeouts: {
        resend: 3 * 60 * 1000, // ms
        code: 3 * 60 * 1000, // ms
      },
    },
  },
}
