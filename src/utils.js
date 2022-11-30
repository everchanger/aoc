const timer = new Map()

const startTimer = (label) => {
  timer.set(label, process.hrtime())
}

const stopTimer = (label) => {
  const elapsed = process.hrtime(timer.get(label))
  const nano = 1000000000
  return (elapsed[0] * nano + elapsed[1]) / 1000000
}

export { startTimer, stopTimer }