import * as core from '@actions/core'
import { readFileSync, writeFileSync } from 'fs'
import { Symbol, get_html } from './template'
// import { wait } from './wait'

async function run(): Promise<void> {
    try {
        // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

        const src: string = core.getInput('src')
        core.info(`Input file path is ${src}`)

        const summary: string = core.getInput('summary')
        core.info(`Summary file path is ${summary}`)

        // Retrieve JSON from file
        const json: string = readFileSync(src, 'utf8')
        core.info(`Received JSON ${src}`)

        const coverage = JSON.parse(json)

        const symbols: Symbol[] = Array<Symbol>()
        for (const [key, value] of Object.entries(coverage['kinds'])) {
            core.info(`Key: ${key}, Value: ${value}`)
            symbols.push({
                name: key,
                documented_number: parseInt(coverage['kinds']['documented_symbol_count'], 10),
                total_number: parseInt(coverage['kinds']['symbol_count'], 10)
            })
        }

        const html: string = get_html(symbols)
        writeFileSync(summary, html, { encoding: 'utf8' })

        core.setOutput('time', new Date().toTimeString())
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
