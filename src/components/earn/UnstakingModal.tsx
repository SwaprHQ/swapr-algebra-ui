import { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { ReactNode, useState } from 'react'
import styled from 'styled-components/macro'

import { useStakingContract } from '../../hooks/useContract'
import { GAS_PRICE_MULTIPLIER } from '../../hooks/useGasPrice'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAppSelector } from '../../state/hooks'
import { StakingInfo } from '../../state/stake/hooks'
import { TransactionType } from '../../state/transactions/actions'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { CloseIcon, TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import FormattedCurrencyAmount from '../FormattedCurrencyAmount'
import Modal from '../Modal'
import { LoadingView, SubmittedView } from '../ModalViews'
import { RowBetween } from '../Row'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function UnstakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  const gasPrice = useAppSelector((state) =>
    state.application.gasPrice.override ? 70 : state.application.gasPrice.fetched
  )

  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onWithdraw() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true)
      await stakingContract
        .exit({ gasLimit: 300000, gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            type: TransactionType.WITHDRAW_LIQUIDITY_STAKING,
            token0Address: stakingInfo.tokens[0].address,
            token1Address: stakingInfo.tokens[1].address,
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          throw new Error('Withdrawing' + error)
        })
    }
  }

  let error: ReactNode | undefined
  if (!account) {
    error = <Trans>Connect Wwallet</Trans>
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? <Trans>Enter an amount</Trans>
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>
              <Trans>Withdraw</Trans>
            </TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOndismiss} />
          </RowBetween>
          {stakingInfo?.stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
              </TYPE.body>
              <TYPE.body>
                <Trans>Deposited liquidity:</Trans>
              </TYPE.body>
            </AutoColumn>
          )}
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
              </TYPE.body>
              <TYPE.body>
                <Trans>Unclaimed UNI</Trans>
              </TYPE.body>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <Trans>When you withdraw, your UNI is claimed and your liquidity is removed from the mining pool.</Trans>
          </TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
            {error ?? <Trans>Withdraw & Claim</Trans>}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              <Trans>Withdrawing {stakingInfo?.stakedAmount?.toSignificant(4)} UNI-V2</Trans>
            </TYPE.body>
            <TYPE.body fontSize={20}>
              <Trans>Claiming {stakingInfo?.earnedAmount?.toSignificant(4)} UNI</Trans>
            </TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>
              <Trans>Transaction Submitted</Trans>
            </TYPE.largeHeader>
            <TYPE.body fontSize={20}>
              <Trans>Withdrew UNI-V2!</Trans>
            </TYPE.body>
            <TYPE.body fontSize={20}>
              <Trans>Claimed UNI!</Trans>
            </TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
