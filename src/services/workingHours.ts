import { WorkSituation } from '../utils/constants'

const baseURL = 'http://localhost:5000/working-hours'

type GetWorkerCurrentSituationService = Promise<{ situation: WorkSituation } | null>

export const getWorkerCurrentSituationService = async (): GetWorkerCurrentSituationService => {
  try {
    const response = await fetch(baseURL)
    const data = await response.json()

    return data
  } catch (error) {
    return null
  }
}

export const postWorkerSituationService = async (currSituation: number) => {
  const nextStatus = currSituation === WorkSituation.EXITING
    ? WorkSituation.ARRIVING
    : WorkSituation.EXITING

  const body = JSON.stringify({
    status: nextStatus,
  })

  const response = await fetch(baseURL, {
    method: 'PUT',
    body,
  })

  const data = await response.json()
}
