import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import kleur from 'kleur'
import dotenv from 'dotenv'
import { fetchInput } from './aoc.js'
import { startTimer, stopTimer } from './utils.js'
dotenv.config()

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const getDayAndYear = () => {
  const today = new Date()
  let year = today.getFullYear().toString()
  let day = today.getDate().toString()

  if (process.argv.length > 2) {
    day = process.argv[2]
  }

  if (process.argv.length > 3) {
    year = process.argv[3]
  }

  if (Number.isNaN(parseInt(day)) || !Number.isInteger(parseInt(day))) {
    throw new Error('Day argument is non-numeric')
  }

  return { day, year }
}

const prepareDay = async (dayPath, day, year) => {
  if (fs.existsSync(dayPath)) {
    return
  }
  fse.copySync(`${currentFilePath}/template`, dayPath)

  if (process.env.AOC_TOKEN) {
    // Fetch the input from the AoC website
    const response = await fetchInput(
      year,
      day.startsWith('0') ? day.substring(1) : day,
      process.env.AOC_TOKEN
    )
    fs.writeFileSync(`${dayPath}/input`, response)
  }
}

const runTests = async (func, data, part)  => {
  let pass = true
  for (const t of data) {
    const result = await func(t.input)
    const testOk = result === parseInt(t.expected)
    if (!testOk) {
      console.log(kleur.red(`Test failed, expected [${t.expected}], got [${result}] (input ${t.input})`))
    }
    pass = pass && testOk
  }

  return pass
}

const run = async (dayPath) => {
  const { taskA, taskB } = await import(`${dayPath}/index.js`)
  const testInput = JSON.parse(fs.readFileSync(`${dayPath}/test.json`, 'utf8'))

  // Run tests before executing the tasks
  console.log(kleur.cyan('\nRunning tests for A...'))

  let pass = await runTests(taskA, testInput.taskA)
  if (!pass) {
    console.error(kleur.red('Tests failed for taskA, aborting'))
    return;
  } else {
    console.log(kleur.green('Tests for taskA is OK!'))
  }

  const input = fs.readFileSync(`${dayPath}/input`, 'utf8')

  console.log(kleur.yellow('\nRunning A...'))
  startTimer('Timer A')
  const resultA = await taskA(input)
  console.log(`  Time: ${stopTimer('Timer A')}ms`)
  console.log(kleur.green('  Result:'), resultA)

  console.log(kleur.cyan('\nRunning tests for B...'))

  pass = await runTests(taskB, testInput.taskB)
  if (!pass) {
    console.error(kleur.red('Tests failed for taskB, aborting'))
    return
  } else {
    console.log(kleur.green('Tests for taskB is OK!'))
  }


  console.log(kleur.yellow('\nRunning B...'))
  startTimer('Timer B')
  const resultB = await taskB(input)
  console.log(`  Time: ${stopTimer('Timer B')}ms`)
  console.log(kleur.green('  Result:'), resultB)
}

const { day, year } = await getDayAndYear()
const currentFilePath = path.dirname(__filename)
const dayPath = `${currentFilePath}/${year}/${day}`

try {
  await prepareDay(dayPath, day, year)
  console.log(`\n\n🎅 Running Advent of Code: Year ${year} Day ${day} 🎅\n`)
  await run(dayPath)
} catch (error) {
  console.log(kleur.red('  Error:'), error.message, error)
}

console.log('\n\n🎄🎄🎄 Done 🎄🎄🎄\n\n')