const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const colors = require('colors/safe')
const https = require('https')
require('dotenv').config()

const today = new Date()
const year = today.getFullYear().toString()
let day = today.getDate().toString()

if (process.argv.length > 2) {
  day = process.argv[2]
}

if (Number.isNaN(parseInt(day)) || !Number.isInteger(parseInt(day))) {
  throw new Error('Day argument is non-numeric')
}

const currentFilePath = path.dirname(__filename)
const dayPath = `${currentFilePath}/${year}/${day}`

const timer = new Map()

function startTimer (label) {
  timer.set(label, process.hrtime())
}

function stopTimer (label) {
  const elapsed = process.hrtime(timer.get(label))
  const nano = 1000000000
  return (elapsed[0] * nano + elapsed[1]) / 1000000
}

async function run () {
  const { taskA, taskB, test } = await import(`${dayPath}/index.mjs`)
  const testInput = JSON.parse(fs.readFileSync(`${dayPath}/test.json`, 'utf8'))

  console.log(`\n\n🎅 Running Advent of Code: Year ${year} Day ${day} 🎅\n`)

  // Run tests before executing the tasks
  console.log(colors.cyan('\nRunning tests for A...'))
  
  let pass = await test(testInput, 'taskA')
  if (!pass) {
    console.error(colors.red('Tests failed for taskA, aborting'))
    return;
  } else {
    console.log(colors.green('Tests for taskA is OK!'))
  }

  const input = fs.readFileSync(`${dayPath}/input`, 'utf8')
  
  console.log(colors.yellow('\nRunning A...'))
  startTimer('Timer A')
  try {
    const resultA = await taskA(input)
    console.log(`  Time: ${stopTimer('Timer A')}ms`)
    console.log(colors.green('  Result:'), resultA)
  } catch (error) {
    console.log(colors.red('  Error:'), error.message)
  }

  console.log(colors.cyan('\nRunning tests for B...'))

  pass = await test(testInput, 'taskB')
  if (!pass) {
    console.error(colors.red('Tests failed for taskB, aborting'))
    return
  } else {
    console.log(colors.green('Tests for taskB is OK!'))
  }


  console.log(colors.yellow('\nRunning B...'))
  startTimer('Timer B')
  try {
    const resultB = await taskB(input)
    console.log(`  Time: ${stopTimer('Timer B')}ms`)
    console.log(colors.green('  Result:'), resultB)
  } catch (error) {
    console.log(colors.red('  Error:'), error.message)
  }
}

prepareDay().then(() => {
  run()
    .then(() => {
      console.log('\n\n🎄🎄🎄 Done 🎄🎄🎄\n\n')
    })
    .catch((error) => console.log(colors.red('Error:'), error.message))
})

async function prepareDay () {
  if (fs.existsSync(dayPath)) {
    return
  }
  fse.copySync(`${currentFilePath}/template`, dayPath)

  if (process.env.AOC_TOKEN) {
    // Fetch the input from the AoC website
    const response = await getAocInput(
      year,
      day.startsWith('0') ? day.substring(1) : day
    )
    fs.writeFileSync(`${dayPath}/input`, response)
  }
}

function getAocInput (year, day) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'adventofcode.com',
        path: `/${year}/day/${day}/input`,
        port: 443,
        method: 'GET',
        headers: {
          Cookie: 'session=' + process.env.AOC_TOKEN
        }
      },
      (res) => {
        res.on('data', (data) => {
          resolve(data.toString())
        })
      }
    )

    console.log(req)

    req.on('error', reject)
    req.end()
  })
}
