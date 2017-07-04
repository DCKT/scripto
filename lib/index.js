const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const { exec } = require('child_process')
const { red, rainbow, bgRed, white } = require('colors')

const prompt = inquirer.createPromptModule()
const readFile = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })

const execScript = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (err) => {
      err ? reject(err) : resolve()
    })
  })

module.exports = () => {
  const packagePath = path.resolve(process.cwd(), './package.json')

  console.log(rainbow(`
    ||||| SCRIPTOS |||||
  `))

  readFile(packagePath)
    .then(data => {
      try {
        const config = JSON.parse(data)

        prompt({
          type: 'list',
          name: 'command',
          message: 'Scripts available',
          choices: Object.keys(config.scripts)
        })
          .then(({ command }) => execScript(`npm run ${command}`))
          .catch(err => {
            console.log('\n')
            console.log(bgRed(white('Something went wrong')))
            console.log(red(err))
            console.log('\n')
          })
      } catch (err) {
        console.log(red.underline('There are some errors in your package.json'))
      }
    })
    .catch(err => {
      if (err.contains('no such file')) {
        console.log(red.underline('package.json not found !'))
      }
    })
}
