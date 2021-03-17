import dayjs from 'dayjs'

export const getCurrentHour = () => dayjs().format('HH:mm:ss')
