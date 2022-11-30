const fetchInput = async (year, day, token) => {
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      Cookie: `session=${token}`
    }
  })
  console.log(response)
  return response.text()
}

const submitAnswer = async (year, day, token, level, answer) => {
  console.log('submitting', year, day, level, answer)
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/answer`, {
    method: 'POST',
    headers: {
      Cookie: `session=${token}`
    },
    body: JSON.stringify({
      level,
      answer
    })
  })
  return (await response.text()).includes('That\'s the right answer!')
}

export { fetchInput, submitAnswer }