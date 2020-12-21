export function toString(d) {
  const datetime = new Date(d)

  const month = datetime.getMonth()
  const date = datetime.getDate()
  const hours = datetime.getHours()
  const minutes = datetime.getMinutes()

  return `${month}/${date} ${hours}:${minutes}〜`
}

export function toDateString(d) {
  const datetime = new Date(d)

  const month = datetime.getMonth()
  const date = datetime.getDate()

  return `${month}/${date}`
}

