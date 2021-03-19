import dayjs, { Dayjs } from 'dayjs'
import _chunk from 'lodash.chunk'
import { workingHourService } from '../services/workingHours'
import { HistoryList, WorkingHours } from '../types/general'
import { WorkSituation } from '../utils/constants'
import { timeConvert } from '../utils/helpers'

type Register = WorkingHours[]

const backendProcessingWorkingTime = (register: HistoryList) => {
  const workingTimeInMinutes = register.reduce((totalHoursInDay, currentDay) => {
    const period = _chunk(currentDay.list, 2)

    const workedHoursInDay = period.reduce((totalHoursInPeriod, currentPeriod) => {
      const isIncompletePeriod = currentPeriod.length === 1
      if (isIncompletePeriod) return totalHoursInPeriod

      const [arriving, exiting] = currentPeriod

      const workedTime = dayjs(exiting.date).diff(arriving.date, 'minutes')

      return totalHoursInPeriod + workedTime
    }, 0)

    return totalHoursInDay + workedHoursInDay
  }, 0)

  const workedTime = timeConvert(workingTimeInMinutes)
  return workedTime
}

const getNextSituation = (situation: WorkSituation) => {
  if (situation === WorkSituation.EXITING) {
    return WorkSituation.ARRIVING
  }

  return WorkSituation.EXITING
}

const backendProcessingToList = (registers: Register) => {
  const format = 'DD MMMM'
  const uniqueDays = [...new Set(
    registers.map((reg) => dayjs(reg.date).format(format)),
  )]

  const filterByDay = (day: string) => registers.filter(
    (register) => dayjs(register.date).format(format) === day,
  )

  const days = uniqueDays.map((day) => ({
    day,
    list: filterByDay(day),
  }))
  return days
}

type GetWorkerCurrentSituation = Promise<WorkSituation | null>

export const getWorkerCurrentSituation = async (): GetWorkerCurrentSituation => {
  try {
    const response = await workingHourService.get<WorkingHours[]>('/', {
      params: {
        _sort: 'id',
        _order: 'desc',
      },
    })
    console.log(response)
    const lastSituation = response.data[0].situation
    const nextSituation = getNextSituation(lastSituation)
    return nextSituation
  } catch (error) {
    return null
  }
}

type PostWorkerSituationParams = {
  situation: WorkSituation,
  date: Dayjs
}
type PostWorkerSituation = Promise<{ nextSituation: WorkSituation } | null>

export const postWorkerSituation = async (
  params: PostWorkerSituationParams,
): PostWorkerSituation => {
  const nextStatus = getNextSituation(params.situation)

  try {
    await workingHourService.post('/', params)

    return { nextSituation: nextStatus }
  } catch (error) {
    return null
  }
}

export const getAllWorkerHour = async () => {
  try {
    const response = await workingHourService.get<WorkingHours[]>('/')
    const registers = response.data
    const registerList = backendProcessingToList(registers)
    const workedTime = backendProcessingWorkingTime(registerList)

    return { registerList, workedTime }
  } catch (error) {
    return null
  }
}
