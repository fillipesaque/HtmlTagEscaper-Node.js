import fs from "node:fs"
import path, { resolve } from "node:path"
import readline from "node:readline"

function escapeHtmlSpecialCharacters(text) {
    return text.replace( /[<>&]/g , (match) => {
        switch( match ){
            case "<":
                return "&lt;"
            case ">":
                return "&gt;"
            case "&":
                return "&amp;"
            default:
                return match
        }
    })
}

function escapeHtmlFile (inputFilePath , outputFilePath) {
    try {
        const fileContent = fs.readFileSync(inputFilePath , "utf-8")
        const escapedContent = escapeHtmlSpecialCharacters(fileContent)
        fs.writeFileSync(outputFilePath , escapedContent , "utf-8")
        console.log(`Arquivo Escapado Com Sucesso ${outputFilePath}`)
    } catch (error) {
        console.log("Error:" , error.message)
        process.exit(1)
    }
}

function askFilePath(question) {
    const rl = readline.createInterface({input: process.stdin , output: process.stdout})

    return new Promise((resolve) => {
        rl.question(question , (answer) => {
            resolve(answer)
            rl.close()
        })
    })
}

async function userInteraction() {
    let inputPath = process.argv[2]
    if (!inputPath) {
        inputPath = await askFilePath("Informe o caminho do arquivo de entrada")
    }
    inputPath = path.resolve(inputPath)

    const defaultName = `escaped_${path.basename(inputPath)}.txt`
    const answer = await askFilePath(`Informe o Caminho do arquivo de saida (padrao: ${defaultName})`)
    let outputPath = answer.length > 0 ? answer : defaultName
    outputPath = path.resolve(outputPath)

    escapeHtmlFile(inputPath , outputPath)
}

userInteraction()