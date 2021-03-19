import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { mutate } from 'swr'
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
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const getInitialSituation = async () => {
      const situation = await getWorkerCurrentSituation()

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

  const updateHistoryList = () => {
    mutate('history')
  }

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

    toast.success('Success!')
    setSituation(response.nextSituation)
    updateHistoryList()
  }

  const [variant, label] = useMemo(() => {
    if (isFetching) return [-1, 'Please wait ...']

    return situation === WorkSituation.ARRIVING
      ? [WorkSituation.ARRIVING, 'Arrive']
      : [WorkSituation.EXITING, 'Exit']
  }, [situation, isFetching])

  const time = getCurrentHour()

  return (
    <Section width="30" height="40">
      <WelcomeMessage>
        Welcome back,
        <span>Walter Kovacs</span>
      </WelcomeMessage>
      <Avatar
        src="https://static.tvtropes.org/pmwiki/pub/images/rco007.jpg"
        alt="User avatar"
      />
      <Timer>{time}</Timer>
      <Button
        type="button"
        onClick={onClickSaveStatus}
        variant={variant}
      >
        {label}
      </Button>
    </Section>
  )
}

export default ActionPanel
