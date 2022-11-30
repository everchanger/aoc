const fetchInput = async (year, day, token) => {
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      Cookie: `session=${token}`
    }
  })
  console.log(response)
  return response.text()
}

export { fetchInput }