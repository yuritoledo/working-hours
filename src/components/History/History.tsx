import dayjs from 'dayjs'
import useSWR from 'swr'
import { getAllWorkerHour } from '../../repositories/workingHours'
import { isOdd } from '../../utils/helpers'
import {
  Line, Registers, Message, Day, WorkedTime,
} from './styles'
import { Section as BaseSection } from '../Section/Section'

const Section = ({ children }) => (
  <BaseSection width="38" height="50">
    {children}
  </BaseSection>
)

const FailMessage = ({ message }) => (
  <Section>
    <Message>{message}</Message>
  </Section>
)

const History = () => {
  const { data, error } = useSWR('history', getAllWorkerHour)

  if (error) {
    return <FailMessage message="Some error happened. Please, try again" />
  }

  if (!data?.registerList?.length) {
    return <FailMessage message="No results found. What do you think about start to work?" />
  }

  return (
    <Section>
      <WorkedTime>{`Worked time: ${data.workedTime}`}</WorkedTime>

      {data?.registerList.map((register) => (
        <Registers key={register.day}>
          <Day>{register.day}</Day>
          <Line>
            <span>Arrived</span>
            <span>Breaks</span>
            <span>Exited</span>
          </Line>
          <Line>
            {register.list.map((hour) => (
              <span key={hour.id}>
                {dayjs(hour.date).format('HH:mm')}
              </span>
            ))}
            {isOdd(register.list.length) && (
              <span>{' - '}</span>
            )}
          </Line>
        </Registers>
      ))}
    </Section>
  )
}

export default History
