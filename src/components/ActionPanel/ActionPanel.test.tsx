import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'
import { mocked } from 'ts-jest/utils'
import { getWorkerCurrentSituation, postWorkerSituation } from '../../repositories/workingHours'
import { WorkSituation } from '../../utils/constants'
import { getCurrentHour } from '../../utils/helpers'
import ActionPanel from './ActionPanel'

const ActionPanelWithToast = () => (
  <>
    <ActionPanel />
    <Toaster
      position="top-center"
    />
  </>
)

jest.mock('../../repositories/workingHours')

const mockedGetWorkerCurrentSituation = mocked(getWorkerCurrentSituation)
const mockedPostWorkerSituation = mocked(postWorkerSituation)

const mockedGetStatusArriving = () => mockedGetWorkerCurrentSituation
  .mockResolvedValue({
    situation: WorkSituation.ARRIVING,
  })

const mockedGetStatusExiting = () => mockedGetWorkerCurrentSituation
  .mockResolvedValue({
    situation: WorkSituation.EXITING,
  })

const mockedPostWorkerSituationSuccess = () => mockedPostWorkerSituation
  .mockResolvedValue({ nextSituation: WorkSituation.EXITING })

const mockedPostWorkerSituationWithError = () => mockedPostWorkerSituation.mockResolvedValue(null)

describe('ActionPanel', () => {
  beforeEach(() => {
    mockedGetWorkerCurrentSituation.mockClear()
    mockedPostWorkerSituation.mockClear()
  })

  it('should render the current time in clock', async () => {
    mockedGetStatusArriving()
    render(<ActionPanelWithToast />)

    const time = getCurrentHour()

    expect(
      await screen.findByText(time),
    ).toBeInTheDocument()
  })

  // it('should show "Arriving" text in Button when is first register', async () => {
  //   mockReturnStatusArriving()
  //   render(<MockedApp />)

  //   expect(
  //     await screen.findByText('Arriving'),
  //   ).toBeInTheDocument()

  //   expect(
  //     screen.queryByText('Exiting'),
  //   ).not.toBeInTheDocument()
  // })

  it('should show "Arriving" Button when previous status is Exiting on opening screen', async () => {
    mockedGetStatusArriving()
    render(<ActionPanelWithToast />)

    expect(
      await screen.findByText('Arriving'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Exiting'),
    ).not.toBeInTheDocument()
  })

  it('should show "Exiting" Button when previous status is Arriving on opening screen', async () => {
    mockedGetStatusExiting()
    render(<ActionPanelWithToast />)

    expect(
      await screen.findByText('Exiting'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Arriving'),
    ).not.toBeInTheDocument()
  })

  it('should Arriving onPress call API, it should respond successfuly and a success message should be visible', async () => {
    mockedPostWorkerSituationSuccess()
    mockedGetStatusArriving()
    render(<ActionPanelWithToast />)

    userEvent.click(
      await screen.findByText('Arriving'),
    )

    expect(mockedPostWorkerSituation).toBeCalledTimes(1)
    // expect(mockedPostWorkerSituation).toBeCalledWith({
    //   situation: WorkSituation.ARRIVING,
    //   date: dayjs(),
    // })

    expect(
      await screen.findByText('Success'),
    ).toBeInTheDocument()
  })

  it('should Arriving onPress call API, it should throw an error and an error message should be visible', async () => {
    mockedPostWorkerSituationWithError()
    mockedGetStatusArriving()
    render(<ActionPanelWithToast />)

    userEvent.click(
      await screen.findByText('Arriving'),
    )

    expect(mockedPostWorkerSituation).toBeCalledTimes(1)
    // expect(mockedPostWorkerSituation).toBeCalledWith({
    //   situation: WorkSituation.ARRIVING,
    //   date: dayjs(),
    // })

    expect(
      await screen.findByText('An error happened! Try again in a few minutes'),
    ).toBeInTheDocument()
  })

  it('should Exiting onPress call API, it should respond successfuly and a success message should be visible', async () => {
    mockedPostWorkerSituationSuccess()
    mockedGetStatusExiting()
    render(<ActionPanelWithToast />)

    userEvent.click(
      await screen.findByText('Exiting'),
    )

    expect(mockedPostWorkerSituation).toBeCalledTimes(1)
    // expect(mockedPostWorkerSituation).toBeCalledWith({
    //   situation: WorkSituation.EXITING,
    //   date: dayjs(),
    // })

    expect(
      await screen.findByText('Success'),
    ).toBeInTheDocument()
  })

  it('should Exiting onPress call API, it should throw an error and an error message should be visible', async () => {
    mockedPostWorkerSituationWithError()
    mockedGetStatusExiting()
    render(<ActionPanelWithToast />)

    userEvent.click(
      await screen.findByText('Exiting'),
    )

    expect(mockedPostWorkerSituation).toBeCalledTimes(1)
    // expect(mockedPostWorkerSituation).toBeCalledWith({
    //   situation: WorkSituation.EXITING,
    //   date: dayjs(),
    // })

    expect(
      await screen.findByText('An error happened! Try again in a few minutes'),
    ).toBeInTheDocument()
  })
})
