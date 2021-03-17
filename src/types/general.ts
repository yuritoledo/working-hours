import { Dayjs } from 'dayjs'
import { WorkSituation } from '../utils/constants'

export type WorkingHours = {
  id: number
  situation: WorkSituation
  date: Dayjs,
}
