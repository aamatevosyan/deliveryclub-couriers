import { JobContract } from '@ioc:Rocketseat/Bull'
import Cache from '@ioc:Adonis/Addons/Adonis5-Cache'
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

export default class SendCodeByPhone implements JobContract {
  public key = 'SendCodeByPhone'

  // @ts-ignore
  public async handle(job) {
    const { phone, uuid } = job.data

    const code = randomIntFromInterval(10000, 99999)
    const cacheKey = `auth.sendcode.phone.${uuid}`

    //TODO: add Twilio sms send
    Logger.info(phone)

    const data = await Cache.get(cacheKey)
    data.code = code
    Logger.info(`Phone Verify: ${uuid} - ${code}`)

    await Cache.put(cacheKey, data, DCCConfig.auth.email.timeouts.code)
  }
}
