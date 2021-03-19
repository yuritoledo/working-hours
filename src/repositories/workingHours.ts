import dayjs, { Dayjs } from 'dayjs'
import { workingHourService } from '../services/workingHours'
import { WorkingHours } from '../types/general'
import { WorkSituation } from '../utils/constants'

const getNextSituation = (situation: WorkSituation) => {
  if (situation === WorkSituation.EXITING) {
    return WorkSituation.ARRIVING
  }

  return WorkSituation.EXITING
}

const backendProcessing = (registers: WorkingHours[]) => {
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
    const response = await workingHourService.get<WorkingHours[]>('/', {
      params: {
        _sort: 'id',
        _order: 'desc',
      },
    })
    const registers = response.data
    const days = backendProcessing(registers)

    return days
  } catch (error) {
    return null
  }
}
