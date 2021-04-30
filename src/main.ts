import * as core from '@actions/core'
// import { wait } from './wait'

async function run(): Promise<void> {
    try {
        // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

        const in_file: string = core.getInput('coverxygen-in')
        core.info(`Input file is ${in_file}`)

        /*
        core.debug(new Date().toTimeString())
        await wait(parseInt(ms, 10))
        core.debug(new Date().toTimeString())
        */

        core.setOutput('time', new Date().toTimeString())
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
