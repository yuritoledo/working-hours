import { Dayjs } from 'dayjs'
import { WorkSituation } from '../utils/constants'

export type WorkingHours = {
  id: number
  situation: WorkSituation
  date: Dayjs,
}

export type HistoryList = Array<{
  day: string;
  list: WorkingHours[];
}>
