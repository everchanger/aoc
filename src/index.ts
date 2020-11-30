import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'
import * as colors from 'colors/safe'

if (process.argv.length <= 2) {
  throw new Error('Missing day argument, please run ´dev X´ where X is the day you want to run')
}

const day = parseInt(process.argv[2])

if (Number.isNaN(day) || !Number.isInteger(day)) {
  throw new Error('Day argument is non-numeric')
}

if (day < 1 || day > 25) {
  throw new Error('Day argument has to be between 1 and 25')
}

const currentFilePath = path.dirname(__filename)
const templatePath = `${currentFilePath}/template`
const dayPath = `${currentFilePath}/${day}`
const inputPath = `${dayPath}/input`

if (!fs.existsSync(dayPath)) {
  fse.copySync(templatePath, dayPath)
}

const timer = new Map<string, [number, number]>()

function startTimer (label: string): void {
  timer.set(label, process.hrtime())
}

function stopTimer (label: string): number {
  const elapsed = process.hrtime(timer.get(label))
  return elapsed[1] / 1000000
}

async function run (): Promise<void> {
  const { taskA, taskB } = await import(dayPath)
  const input = fs.readFileSync(inputPath, 'utf8')

  console.log(`\n\n🎅 Running Advent of Code: Day ${day} 🎅\n`)

  console.log(colors.yellow('\nRunning A...'))
  startTimer('Timer A')
  try {
    const resultA = await taskA(input)
    console.log(`  Time: ${stopTimer('Timer A')}ms`)
    console.log(colors.green('  Result:'), resultA)
  } catch (error) {
    console.log(colors.red('  Error:'), error.message)
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

run().then(() => {
  console.log('\n\n🎄🎄🎄 Done 🎄🎄🎄\n\n')
}).catch((error) => console.log(colors.red('Error:'), error.message))
