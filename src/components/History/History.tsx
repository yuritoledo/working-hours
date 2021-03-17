import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { getAllWorkerHour } from '../../repositories/workingHours'
import { WorkingHours } from '../../types/general'
import { Container } from '../ActionPanel/styles'
import { Line, Registers } from './styles'

type List = {
  day: string;
  list: WorkingHours[];
}[]
const History = () => {
  const [list, setList] = useState<List>([])

  useEffect(() => {
    const feedList = async () => {
      const response = await getAllWorkerHour()
      if (!response) return

      setList(response)
    }
    feedList()
  }, [])
  const isOdd = (value) => value % 2 !== 0
  return (
    <Container>
      {list.map((dayRegister) => (
        <Registers key={dayRegister.day}>
          <h1>{dayRegister.day}</h1>
          <Line>
            <span>Arriving</span>
            <span>Breaks</span>
            <span>Exiting</span>
          </Line>
          <Line>
            {dayRegister.list.map((hour) => (
              <span>{dayjs(hour.date).format('HH:mm')}</span>
            ))}
            {isOdd(dayRegister.list.length) && (
              <span>Pending...</span>
            )}
          </Line>
        </Registers>
      ))}
      {/* <button type="button" onClick={() => feedList()}>refresh</button> */}
    </Container>
  )
}

export default History
