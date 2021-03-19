import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { getAllWorkerHour } from '../../repositories/workingHours'
import { HistoryList } from '../../types/general'
import { isOdd } from '../../utils/helpers'
import {
  Line, Registers, NoResultMessage, Day,
} from './styles'
import { Section as BaseSection } from '../Section'

const Section = ({ children }) => (
  <BaseSection width="35" height="50">
    {children}
  </BaseSection>
)

const History = () => {
  const [registerList, setRegisterList] = useState<HistoryList>([])
  const [workedTime, setWorkedTime] = useState('')

  useEffect(() => {
    const feedList = async () => {
      const response = await getAllWorkerHour()
      if (!response) return

      setRegisterList(response.registerList)
      setWorkedTime(response.workedTime)
    }
    feedList()
  }, [])

  if (!registerList.length) {
    return (
      <Section>
        <NoResultMessage>
          No results found
        </NoResultMessage>
      </Section>
    )
  }

  return (
    <Section>
      <h1>{`Worked time: ${workedTime}`}</h1>

      {registerList.map((register) => (
        <Registers key={register.day}>
          <Day>{register.day}</Day>
          <Line>
            <span>Arriving</span>
            <span>Breaks</span>
            <span>Exiting</span>
          </Line>
          <Line>
            {register.list.map((hour) => (
              <span key={hour.id}>
                {dayjs(hour.date).format('HH:mm')}
              </span>
            ))}
            {isOdd(register.list.length) && (
              <span>Pending...</span>
            )}
          </Line>
        </Registers>
      ))}
    </Section>
  )
}

export default History
