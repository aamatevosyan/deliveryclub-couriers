/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('phone', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  const regexp = /^\+[1-9]\d{1,14}$/

  if (!regexp.test(value)) {
    options.errorReporter.report(
      options.pointer,
      'phone',
      'phone validation failed',
      options.arrayExpressionPointer
    )
  }
})
