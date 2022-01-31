import { JobContract } from '@ioc:Rocketseat/Bull'

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

export default class SendCodeByEmail implements JobContract {
  public key = 'SendCodeByEmail'

  // @ts-ignore
  public async handle(job) {
    const { email, uuid } = job

    console.log(email, uuid)
  }
}
