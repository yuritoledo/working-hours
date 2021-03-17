import { workingHourService } from '../services/workingHours'
import { WorkSituation } from '../utils/constants'

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
  time: string
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
