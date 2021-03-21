import {
  screen, render, waitFor,
} from '@testing-library/react'
import dayjs from 'dayjs'
import { SWRConfig } from 'swr'
import { mocked } from 'ts-jest/utils'
import { getAllWorkerHour } from '../../repositories/workingHours'
import { AllWorkerHour } from '../../types/general'
import History from './History'

jest.mock('../../repositories/workingHours')

const mockedGetAllWorkerHour = mocked(getAllWorkerHour)

const mockList: AllWorkerHour = {
  workedTime: '03:00',
  registerList: [
    {
      day: 'March 16',
      list: [
        { situation: 0, date: dayjs('2021-03-16T13:00:00.473Z'), id: 1 },
        { situation: 1, date: dayjs('2021-03-16T14:00:00.545Z'), id: 2 },
        { situation: 0, date: dayjs('2021-03-16T15:00:00.101Z'), id: 3 },
        { situation: 1, date: dayjs('2021-03-16T16:00:00.101Z'), id: 4 },
      ],
    },
    {
      day: 'March 17',
      list: [
        { situation: 1, date: dayjs('2021-03-17T09:00:00.473Z'), id: 5 },
        { situation: 0, date: dayjs('2021-03-17T10:00:00.545Z'), id: 6 },
      ],
    },
  ],
}

const mockGetAllWorkerHourReturn = (data: AllWorkerHour | null = mockList) => (
  mockedGetAllWorkerHour.mockResolvedValueOnce(data)
)

const HistoryWithSWR = () => (
  <SWRConfig value={{ dedupingInterval: 0 }}>
    <History />
  </SWRConfig>
)

describe('History', () => {
  beforeEach(() => {
    mockedGetAllWorkerHour.mockClear()
  })

  it('should call API when component is shown, it should respond successfuly and feed the list', async () => {
    mockGetAllWorkerHourReturn()
    render(<HistoryWithSWR />)

    await waitFor(
      () => expect(
        screen.queryByText('No results found. What do you think about start to work?'),
      ).not.toBeInTheDocument(),
    )

    mockList.registerList.forEach((register) => {
      expect(
        screen.getByText(register.day),
      ).toBeInTheDocument()

      register.list.forEach((item) => {
        const hour = item.date.format('HH:mm')
        expect(
          screen.getByText(hour),
        ).toBeInTheDocument()
      })
    })
  })

  it('should show "No results found. What do you think about start to work?" message on list when it was empty', async () => {
    mockGetAllWorkerHourReturn(null)
    render(<HistoryWithSWR />)

    expect(
      await screen.findByText('No results found. What do you think about start to work?'),
    ).toBeInTheDocument()

    expect(mockedGetAllWorkerHour).toBeCalledTimes(1)
  })

  it('should show "Some error happened. Please, try again" message on list when api return error', async () => {
    mockedGetAllWorkerHour.mockRejectedValue('alo')
    render(<HistoryWithSWR />)

    expect(
      await screen.findByText('Some error happened. Please, try again'),
    ).toBeInTheDocument()

    expect(mockedGetAllWorkerHour).toBeCalledTimes(1)
  })

  it('should call API, it should fail and the list shouldn\'t be feeded', async () => {
    mockGetAllWorkerHourReturn(null)
    render(<HistoryWithSWR />)

    expect(
      await screen.findByText('No results found. What do you think about start to work?'),
    ).toBeInTheDocument()
  })

  it('should show the amount of time worked', async () => {
    mockGetAllWorkerHourReturn()
    render(<HistoryWithSWR />)
    const workedTime = '03:00'

    expect(
      await screen.findByText(`Worked time: ${workedTime}`),
    ).toBeInTheDocument()
  })
})
