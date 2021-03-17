import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getWorkerCurrentSituation, postWorkerSituation } from '../../repositories/workingHours'
import { WorkSituation } from '../../utils/constants'
import { getNowTime } from '../../utils/helpers'
import { Container, Button } from './styles'

const ActionPanel = () => {
  const [time, setTime] = useState(getNowTime())
  const [situation, setSituation] = useState<WorkSituation>(-1)
  const [isFetching, setIsFetching] = useState(true)

  setInterval(() => {
    setTime(getNowTime())
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
      time,
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
