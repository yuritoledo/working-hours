import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getWorkerCurrentSituation, postWorkerSituation } from '../../repositories/workingHours'
import { WorkSituation } from '../../utils/constants'
import { getCurrentHour } from '../../utils/helpers'
import { Container, Button } from './styles'

const ActionPanel = () => {
  const [date, setDate] = useState(dayjs())
  const [situation, setSituation] = useState<WorkSituation>(WorkSituation.ARRIVING)
  const [isFetching, setIsFetching] = useState(true)

  setInterval(() => {
    setDate(dayjs())
  }, 1000)

  useEffect(() => {
    const getInitialSituation = async () => {
      const response = await getWorkerCurrentSituation()
      setIsFetching(false)
      if (!response) return

      setSituation(response.situation)
    }

    getInitialSituation()
  }, [])

  const onClickSaveStatus = async () => {
    setIsFetching(true)
    const response = await postWorkerSituation({
      situation,
      date,
    })
    setIsFetching(false)

    if (!response) {
      toast.error('An error happened! Try again in a few minutes')
      return
    }

    toast.success('Success')
    setSituation(response.nextSituation)
  }

  const situationLabel = useMemo(() => {
    if (isFetching) return 'Please wait ...'

    return situation === WorkSituation.ARRIVING
      ? 'Arriving'
      : 'Exiting'
  }, [isFetching])

  const time = getCurrentHour()

  return (
    <Container>
      <h1>{time}</h1>
      <Button type="button" onClick={onClickSaveStatus}>
        {situationLabel}
      </Button>
    </Container>
  )
}

export default ActionPanel
