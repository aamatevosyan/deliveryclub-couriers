import { JobContract } from '@ioc:Rocketseat/Bull'
import Cache from '@ioc:Adonis/Addons/Adonis5-Cache'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import DCCConfig from 'Config/dcc'


/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default class SendCodeByEmail implements JobContract {
  public key = 'SendCodeByEmail'

  // @ts-ignore
  public async handle(job) {
    const { email, uuid } = job.data

    const code = randomIntFromInterval(10000, 99999)
    const cacheKey = `auth.sendcode.${uuid}`

    await Mail.send((message) => {
      message
        .from('info@dcc.ru') // TODO: add config for email address
        .to(email)
        .subject('Delivery Club Couriers: Verify email address') // TODO: add config for subject
        .htmlView('auth/email-confirm', { code })
    })

    const data = await Cache.get(cacheKey)
    data.code = code
    Logger.info(`Email Verify: ${uuid} - ${code}`)

    await Cache.put(cacheKey, data, DCCConfig.auth.email.timeouts.code)
  }
}
