import * as core from '@actions/core'
import { readFileSync, writeFileSync } from 'fs'
//import nodeHtmlToImage from 'node-html-to-image'
import { Symbol, getHtml } from './template'
// import { wait } from './wait'

async function run(): Promise<void> {
    try {
        // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
        // Use core.info for now to simplify things

        // Get action inputs
        const src_path: string = core.getInput('src')
        const html_path: string = core.getInput('html')
        const image_path: string = core.getInput('image')
        const output_type: string = core.getInput('output')

        // Log the inputs back out for debugging
        core.info(`Source file path is ${src_path} (input file)`)
        core.info(`HTML file path is ${html_path} (output file)`)
        core.info(`Image file path is ${image_path} (output file)`)
        if (output_type === 'html' || output_type === 'image') {
            core.info(`Output type is  ${output_type} (option)`)
        } else {
            core.setFailed('Output type invalid')
        }

        // Retrieve JSON from source file
        const json: string = readFileSync(src_path, 'utf8')
        const coverage = JSON.parse(json)

        // Parse coverxygen JSON output
        const symbols: Symbol[] = Array<Symbol>()
        for (const [key, value] of Object.entries(coverage['kinds'])) {
            const symbol = {
                name: key,
                documented_number: parseInt(coverage['kinds'][key]['documented_symbol_count']),
                total_number: parseInt(coverage['kinds'][key]['symbol_count'])
            }
            symbols.push(symbol)
            core.info(JSON.stringify(symbol))
        }

        // Generate the HTML output
        const html_output: string = getHtml(symbols)

        // Write the HTML output to a file if needed
        if (output_type === 'html') {
            writeFileSync(html_path, html_output, { encoding: 'utf8' })
        }

        // Create the image if needed
        if (output_type === 'image') {
            /*
            let image_type = 'png'
            if (image_path.endsWith('.jpg')) {
                image_type = 'jpg'
            } else if (image_path.endsWith('.png')) {
                image_type = 'png'
            } else {
                core.setFailed('Image file extension is invalid')
            }
            nodeHtmlToImage({
                output: './image.jpg',
                html: html_output,
                type: image_type,
                encoding: 'binary'
            })
            */
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
