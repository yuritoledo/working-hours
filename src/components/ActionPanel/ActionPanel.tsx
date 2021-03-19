import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getWorkerCurrentSituation, postWorkerSituation } from '../../repositories/workingHours'
import { WorkSituation } from '../../utils/constants'
import { getCurrentHour } from '../../utils/helpers'
import { Section } from '../Section'
import {
  Avatar, Button, Timer, WelcomeMessage,
} from './styles'

const ActionPanel = () => {
  const [date, setDate] = useState(dayjs())
  const [situation, setSituation] = useState<WorkSituation>(WorkSituation.ARRIVING)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const getInitialSituation = async () => {
      const situation = await getWorkerCurrentSituation()
      setIsFetching(false)
      if (!situation) return

      setSituation(situation)
    }

    getInitialSituation()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(dayjs())
    }, 1000)

    return () => clearInterval(interval)
  }, [date])

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
      ? 'Arrive'
      : 'Exit'
  }, [situation])

  const time = getCurrentHour()

  return (
    <Section>
      <WelcomeMessage>
        Welcome back,
        <span>Walter Kovacs</span>
      </WelcomeMessage>
      <Avatar />
      <Timer>{time}</Timer>
      <Button
        type="button"
        onClick={onClickSaveStatus}
        variant={situation}
      >
        {situationLabel}
      </Button>
    </Section>
  )
}

export default ActionPanel
