import dayjs, { Dayjs } from 'dayjs'
import { workingHourService } from '../services/workingHours'
import { WorkingHours } from '../types/general'
import { WorkSituation } from '../utils/constants'

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

type GetWorkerCurrentSituation = Promise<{ situation: WorkSituation } | null>

export const getWorkerCurrentSituation = async (): GetWorkerCurrentSituation => {
  try {
    const response = await workingHourService.get('/')

    return response.data
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
  const nextStatus = params.situation === WorkSituation.EXITING
    ? WorkSituation.ARRIVING
    : WorkSituation.EXITING

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

    const days = backendProcessing(registers)

    return days
  } catch (error) {
    return null
  }
}
