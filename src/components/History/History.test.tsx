import { screen, render, waitFor } from '@testing-library/react'
import dayjs from 'dayjs'
import { Toaster } from 'react-hot-toast'
import { mocked } from 'ts-jest/utils'
import { getAllWorkerHour } from '../../repositories/workingHours'
import { HistoryList } from '../../types/general'
import History from './History'

jest.mock('../../repositories/workingHours')

const mockedGetAllWorkerHour = mocked(getAllWorkerHour)

const mockList: HistoryList = [
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
]

const listDataWithPendent: HistoryList = [
  {
    day: 'March 16',
    list: [
      { situation: 0, date: dayjs('2021-03-16T13:20:59.473Z'), id: 1 },
      { situation: 1, date: dayjs('2021-03-16T14:21:06.545Z'), id: 2 },
      { situation: 0, date: dayjs('2021-03-16T15:21:12.101Z'), id: 3 },
    ],
  },
  {
    day: 'March 17',
    list: [
      { situation: 1, date: dayjs('2021-03-17T09:20:59.473Z'), id: 4 },
      { situation: 0, date: dayjs('2021-03-17T10:21:06.545Z'), id: 5 },
    ],
  },
]

const mockGetAllWorkerHourReturn = (data: HistoryList | null = mockList) => {
  mockedGetAllWorkerHour.mockResolvedValue(data)
}

const HistoryWithToast = () => (
  <>
    <History />
    <Toaster position="top-center" />
  </>
)

describe('History', () => {
  beforeEach(() => {
    mockedGetAllWorkerHour.mockClear()
  })

  it('should show "No results found" message on list when it was empty', async () => {
    mockGetAllWorkerHourReturn([])
    render(<HistoryWithToast />)

    expect(
      await screen.findByText('No results found'),
    ).toBeInTheDocument()

    expect(mockedGetAllWorkerHour).toBeCalledTimes(1)
  })

  it('should call API when component is shown, it should respond successfuly and feed the list', async () => {
    mockGetAllWorkerHourReturn()
    render(<HistoryWithToast />)

    await waitFor(
      () => expect(
        screen.queryByText('No results found'),
      ).not.toBeInTheDocument(),
    )

    mockList.forEach((register) => {
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

  it('should call API, it should fail and the list shouldn\'t be feeded', async () => {
    mockGetAllWorkerHourReturn(null)
    render(<HistoryWithToast />)

    expect(
      await screen.findByText('No results found'),
    ).toBeInTheDocument()
  })

  it('should show "pending ..." message when it dont have a exiting time', async () => {
    mockGetAllWorkerHourReturn(listDataWithPendent)
    render(<HistoryWithToast />)

    expect(
      await screen.findByText('Pending...'),
    ).toBeInTheDocument()
  })

  it('should show the amount of time worked', async () => {
    mockGetAllWorkerHourReturn()
    render(<HistoryWithToast />)
    const workedTime = '03:00'

    expect(
      await screen.findByText(`Working time: ${workedTime}`),
    ).toBeInTheDocument()
  })
})
