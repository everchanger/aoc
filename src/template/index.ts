async function taskA (input: string): Promise<string> {
  return 'task A'
}

async function taskB (input: string): Promise<string> {
  return 'task B'
}

export { taskA, taskB }
