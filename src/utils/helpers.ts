import dayjs from 'dayjs'

export const getCurrentHour = () => dayjs().format('HH:mm:ss')

export const isOdd = (value: number) => value % 2 !== 0

export const timeConvert = (num: number) => {
  const rawHour = Math.floor(num / 60)
  const rawMinutes = num % 60

  const valueWithZeroAtLeft = (value: number) => String(value).padStart(2, '0')

  const hour = valueWithZeroAtLeft(rawHour)
  const minutes = valueWithZeroAtLeft(rawMinutes)

  return `${hour}:${minutes}`
}
