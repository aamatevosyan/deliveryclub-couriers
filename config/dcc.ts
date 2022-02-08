export default {
  auth: {
    email: {
      timeouts: {
        resend: 5 * 60 * 1000, // ms
        code: 24 * 60 * 60 * 1000 // ms
      },
      from: 'info@dcc.ru',
      subject: 'Delivery Club Couriers: Verify email address'
    },
    phone: {
      timeouts: {
        resend: 3 * 60 * 1000, // ms
        code: 3 * 60 * 1000 // ms
      }
    }
  }
}
