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

const mockedGetStatusArrive = () => (
  mockedGetWorkerCurrentSituation.mockResolvedValue({
    situation: WorkSituation.ARRIVING,
  })
)

const mockedGetStatusExit = () => (
  mockedGetWorkerCurrentSituation.mockResolvedValue({
    situation: WorkSituation.EXITING,
  })
)

const mockedPostWorkerSituationSuccess = () => mockedPostWorkerSituation
  .mockResolvedValue({ nextSituation: WorkSituation.EXITING })

const mockedPostWorkerSituationWithError = () => mockedPostWorkerSituation.mockResolvedValue(null)

describe('ActionPanel', () => {
  beforeEach(() => {
    mockedGetWorkerCurrentSituation.mockClear()
    mockedPostWorkerSituation.mockClear()
  })

  it('should render the current time in clock', async () => {
    mockedGetStatusArrive()
    render(<ActionPanelWithToast />)

    const time = getCurrentHour()

    expect(
      await screen.findByText(time),
    ).toBeInTheDocument()
  })

  it('should show "Arrive" text in Button when is first register', async () => {
    mockedPostWorkerSituationWithError()
    render(<ActionPanelWithToast />)

    expect(
      await screen.findByText('Arrive'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Exit'),
    ).not.toBeInTheDocument()
  })

  it('should show "Arrive" Button when previous status is Exit on opening screen', async () => {
    mockedGetStatusArrive()
    render(<ActionPanelWithToast />)

    expect(
      await screen.findByText('Arrive'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Exit'),
    ).not.toBeInTheDocument()
  })

  it('should show "Exit" Button when previous status is Arrive on opening screen', async () => {
    mockedGetStatusExit()
    render(<ActionPanelWithToast />)

    expect(
      await screen.findByText('Exit'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Arrive'),
    ).not.toBeInTheDocument()
  })

  it('should Arrive onPress call API, it should respond successfuly and a success message should be visible', async () => {
    mockedPostWorkerSituationSuccess()
    mockedGetStatusArrive()
    render(<ActionPanelWithToast />)

    userEvent.click(
      await screen.findByText('Arrive'),
    )

    expect(mockedPostWorkerSituation).toBeCalledTimes(1)

    expect(
      await screen.findByText('Success!'),
    ).toBeInTheDocument()
  })

  it('should Arrive onPress call API, it should throw an error and an error message should be visible', async () => {
    mockedPostWorkerSituationWithError()
    mockedGetStatusArrive()
    render(<ActionPanelWithToast />)

    userEvent.click(
      await screen.findByText('Arrive'),
    )

    expect(mockedPostWorkerSituation).toBeCalledTimes(1)

    expect(
      await screen.findByText('An error happened! Try again in a few minutes'),
    ).toBeInTheDocument()
  })

  it('should Exit onPress call API, it should respond successfuly and a success message should be visible', async () => {
    mockedPostWorkerSituationSuccess()
    mockedGetStatusExit()
    render(<ActionPanelWithToast />)

    userEvent.click(
      await screen.findByText('Exit'),
    )

    expect(mockedPostWorkerSituation).toBeCalledTimes(1)

    expect(
      await screen.findByText('Success!'),
    ).toBeInTheDocument()
  })

  it('should Exit onPress call API, it should throw an error and an error message should be visible', async () => {
    mockedPostWorkerSituationWithError()
    mockedGetStatusExit()
    render(<ActionPanelWithToast />)

    userEvent.click(
      await screen.findByText('Exit'),
    )

    expect(mockedPostWorkerSituation).toBeCalledTimes(1)

    expect(
      await screen.findByText('An error happened! Try again in a few minutes'),
    ).toBeInTheDocument()
  })
})
