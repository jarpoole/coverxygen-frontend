import * as core from '@actions/core'

const css = `
.missing-documentation {
    color: red;
}
.complete-documentation{
    color: green;
}
/* Table row styling */
.symbol-col{
    width: min-content;  /* Row width should be the minimum required to contain all text */
    white-space: nowrap; /* Keep all text on a single line */
}
.ratio-col{
    text-align: center;
    width: 30%;
}
.percentage-bar-col{
    width: 70%;
}
body {
    background-color: rgb(168, 168, 168);
}
.partial-percentage-bar{
    position: relative;
    overflow: hidden; /* Ensures that the 'before' element doesn't overflow the div */
    width: auto;
    border: 3px solid black;
    border-radius: 1rem;

    margin-left: 1rem;
    margin-right: 1rem;
    height: 1rem;
    
}
.partial-percentage-bar::before {
    content: var(--percentage-bar-text);
    font-weight: bold;
    text-align: center;
    padding-left: 0rem;
    position: absolute; /* Position in direct correlation to the parent div */
    left: 0;            /* lock the left edge against the left edge of the parent div */
    height: 100%;  
    width: var(--percentage-bar-value);    
    background-color: var(--percentage-bar-color);
}
.total-percentage-bar{
    position: relative;
    overflow: hidden; /* Ensures that the 'before' element doesn't overflow the div */
    width: auto;
    border: 3px solid black;
    border-radius: 1rem;

    height: 1.8rem;
    
}
.total-percentage-bar::before {
    display: flex;
    content: var(--percentage-bar-text);
    font-weight: bold;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    padding-left: 0rem;
    position: absolute; /* Position in direct correlation to the parent div */
    left: 0;            /* lock the left edge against the left edge of the parent div */
    height: 100%;       
    width: var(--percentage-bar-value);
    background-color: var(--percentage-bar-color);
}
table {
    width: 100%;
    margin-right: 1rem; /* Center the table in the viewport */
}  
th {
    text-align: left;
}
table, th, td {
    border: 50;
    border-color: black;
    border-style: solid; 
    border-collapse: collapse; /* Merge the individual table, th and td borders together into one border */
}
th, td {
    padding: 5px;
}
`

export interface Symbol {
    name: string
    documented_number: number
    total_number: number
}

export function get_html(symbols: Symbol[]): string {
    const title = 'Documentation Coverage'
    const head = `
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>${title}</title>
            <style>${css}</style>
        </head>
    `

    // Define body
    let body = `<body>`
    // Add table
    body += `<table class="results">`
    // Add table column headers
    body += `
        <tr>
            <th class="symbol-col">Symbol type</th>
            <th colspan="2">Coverage</th>
        </tr>
    `
    // Add symbols rows
    for (const symbol of symbols) {
        const percentage = Math.floor((symbol.documented_number / symbol.total_number) * 100)
        body += `
            <tr>
                <td class="symbol-col">${symbol.name}</td>
                <td class="ratio-col"><span class="complete-documentation">${symbol.documented_number}</span>/${symbol.total_number}</td>
                <td class="percentage-bar-col">
                    <div class="partial-percentage-bar" style="
                        --percentage-bar-color: ${symbol.documented_number === symbol.total_number ? 'green' : 'red'}; 
                        --percentage-bar-text:'${percentage}%'; 
                        --percentage-bar-value: ${percentage}%;
                        ">
                    </div>
                </td>
            </tr>
        `
    }
    // Close table tag
    body += `</table>`

    const all_documented: number = symbols.reduce((total, symbol) => {
        return total + symbol.documented_number
    }, 0)
    const all_symbols: number = symbols.reduce((total, symbol) => {
        return total + symbol.total_number
    }, 0)
    const all_percentage = Math.floor((all_documented / all_symbols) * 100)

    core.info(`Documented symbols ${all_documented}`)
    core.info(`All symbols ${all_symbols}`)
    core.info(`Percentage ${all_percentage}`)

    // Add summary section
    body += `
        <h1 style="font-size: 1.5rem;">Overall Documentation Health</h1>
        <div class="total-percentage-bar" style="
            --percentage-bar-color: ${all_documented === all_symbols ? 'green' : 'red'}; 
            --percentage-bar-text:'${all_percentage}%'; 
            --percentage-bar-value: ${all_percentage}%;
        "></div>
`
    const html = `
        <!doctype html>
        <html lang="en">
        ${head}
        ${body}
        </html>
    `

    return html
}
