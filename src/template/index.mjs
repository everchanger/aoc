async function taskA (input) {
  console.log('task A', input)
  return input
}

async function taskB (input) {
  console.log('task B', input)
  return input
}

async function test (data, part) {
  let pass = true
  for (const t of data[part]) {
    const func = part === 'taskA' ? taskA : taskB
    const result = await func(t.input)
    const testOk = result == t.expected
    if (!testOk) {
      console.log(`Test failed for ${part}, expected [${t.expected}], got [${result}] (input ${t.input})`)
    }
    pass = pass && testOk
  }
  
  return pass
}

export { taskA, taskB, test }
