import { Plus } from 'react-feather'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { convertDateTime, getCountdownTime } from '../../utils/time'
import { getProgress } from '../../utils/getProgress'
import Loader from '../Loader'
import CurrencyLogo from '../CurrencyLogo'
import {
    Card,
    CardHeader,
    EventEndTime,
    EventProgress,
    LoadingShim,
    PoolsSymbols,
    RewardAmount,
    RewardSymbol,
    RewardWrapper,
    StakeButton,
    StakeDate,
    StakeInfo,
    Subtitle,
    TokenIcon,
    TokensIcons
} from './styled'
import { useMemo } from 'react'
import { convertLocalDate } from '../../utils/convertDate'
import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from '../../constants/chains'
import { WrappedCurrency } from '../../models/types'
import './index.scss'

interface StakerEventCardProps {
    active?: boolean
    skeleton?: any
    now?: number
    refreshing?: boolean
    stakeHandler?: () => void
    event?: {
        pool?: any
        createdAtTimestamp?: string
        rewardToken?: any
        bonusRewardToken?: any
        reward?: number
        bonusReward?: number
        startTime?: number
        endTime?: number
        apr?: number
    };
    eternal?: boolean
}

export function StakerEventCard({
    active, skeleton, refreshing, stakeHandler, now, event: {
        pool,
        createdAtTimestamp,
        rewardToken,
        bonusRewardToken,
        reward,
        bonusReward,
        startTime,
        endTime,
        apr
    } = {},
    eternal
}: StakerEventCardProps) {
    const { account } = useActiveWeb3React()
    const toggleWalletModal = useWalletModalToggle()

    const _startTime = useMemo(() => {
        if (!startTime) return []

        const date = new Date(+startTime * 1000)

        return [convertLocalDate(date), convertDateTime(date)]
    }, [startTime])

    const _endTime = useMemo(() => {
        if (!endTime) return []

        const date = new Date(+endTime * 1000)

        return [convertLocalDate(date), convertDateTime(date)]
    }, [endTime])

    return skeleton ? (
        <Card skeleton>
            <CardHeader>
                <TokensIcons>
                    <TokenIcon skeleton />
                    <TokenIcon skeleton />
                </TokensIcons>
                <div>
                    <Subtitle skeleton />
                    <PoolsSymbols skeleton />
                </div>
            </CardHeader>
            <RewardWrapper skeleton style={{ marginBottom: '6px' }}>
                <TokenIcon skeleton />
                <div style={{ marginLeft: '1rem' }}>
                    <Subtitle skeleton />
                    <RewardSymbol skeleton />
                </div>
                <RewardAmount skeleton />
            </RewardWrapper>
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        position: 'absolute',
                        left: 'calc(50% - 11px)',
                        top: '-15px',
                        backgroundColor: '#5aa7df',
                        borderRadius: '50%',
                        padding: '3px'
                    }}
                >
                    <Plus style={{ display: 'block' }} size={18} />
                </div>
            </div>
            <RewardWrapper skeleton>
                <TokenIcon skeleton />
                <div style={{ marginLeft: '1rem' }}>
                    <Subtitle skeleton />
                    <RewardSymbol skeleton />
                </div>
                <RewardAmount skeleton />
            </RewardWrapper>
            <StakeInfo active>
                <div>
                    <Subtitle skeleton />
                    <StakeDate skeleton />
                    <StakeDate skeleton />
                </div>
                <div>
                    <Subtitle skeleton />
                    <StakeDate skeleton />
                    <StakeDate skeleton />
                </div>
            </StakeInfo>
            {active ? (
                <>
                    <EventEndTime skeleton>
                        <span />
                    </EventEndTime>
                    <EventProgress skeleton />
                </>
            ) : (
                <StakeButton skeleton />
            )}
        </Card>
    ) : (
        <div className={'staker-event-card p-1 br-12'} data-refreshing={refreshing}>
            {refreshing && (
                <LoadingShim>
                    <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto' }} />
                </LoadingShim>
            )}
            <div className={'f mb-1'}>
                <div className={'f mr-1'}>
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, pool.token0.id, 18, pool.token0.symbol) as WrappedCurrency}
                        size={'35px'}
                    />
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, pool.token1.id, 18, pool.token1.symbol) as WrappedCurrency}
                        size={'35px'}
                    />
                </div>
                <div>
                    <h3 className={'fs-075 b'}>POOL</h3>
                    <div>{`${pool.token0.symbol}/${pool.token1.symbol}`}</div>
                </div>
            </div>
            <div className={'staker-event-card__reward-wrapper mb-1 f f-ac p-05 br-8'}>
                <CurrencyLogo
                    currency={new Token(SupportedChainId.POLYGON, rewardToken.id, 18, rewardToken.symbol) as WrappedCurrency}
                    size={'35px'}
                />
                <div className={'ml-1 f c'}>
                    <span className={'c-ph fs-075 b'}>REWARD</span>
                    <span>{rewardToken.symbol}</span>
                </div>
                {reward && (
                    <div className={'m-a mr-0 fs-125'} title={reward.toString()}>
                        {eternal ? <span /> :
                            <span>{('' + reward).length <= 10 ? reward : ('' + reward).slice(0, 8) + '..'}</span>
                        }
                    </div>
                )}
            </div>
            <div className={'staker-event-card__plus'}>
                <div>
                    <Plus style={{ display: 'block' }} size={18} />
                </div>
            </div>
            {bonusReward && bonusReward > 0 && (
                <div className={'staker-event-card__reward-wrapper mb-1 f f-ac p-05 br-8'}>
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, bonusRewardToken.id, 18, bonusRewardToken.symbol) as WrappedCurrency}
                        size={'35px'}
                    />
                    <div className={'ml-1 f c'}>
                        <span className={'c-ph fs-075 b'}>BONUS</span>
                        <span>{bonusRewardToken.symbol}</span>
                    </div>
                    {bonusReward && (
                        <div className={'m-a mr-0 fs-125'} title={bonusReward.toString()}>
                            {eternal ?
                                <span /> :
                                <span>{('' + bonusReward).length <= 10 ? bonusReward : ('' + bonusReward).slice(0, 8) + '..'}</span>
                            }
                        </div>
                    )}
                </div>
            )}
            {!eternal && (
                <div className={'flex-s-between mb-05'} data-active>
                    <div className={'f c'}>
                        <span className={'fs-075 b'}>START</span>
                        <span>
                            {startTime && _startTime[0]}
                        </span>
                        <span>
                            {startTime && _startTime[1]}
                        </span>
                    </div>
                    <div className={'f c'}>
                        <span className={'fs-075 b'}>END</span>
                        <span>
                            {endTime && _endTime[0]}
                        </span>
                        <span>
                          {endTime && _endTime[1]}
                        </span>
                    </div>
                </div>
            )}
            {!eternal && (
                <div className={'fs-075 ta-c'}>
                    {active ? (
                        <span>{`ends in ${getCountdownTime(endTime ?? 0, now ?? Date.now())}`}</span>
                    ) : (
                        <span>{`starts in ${getCountdownTime(startTime ?? 0, now ?? Date.now())}`}</span>
                    )}
                </div>
            )}
            {!eternal && (
                <div className={'staker-event-card__progress w-100 br-8 p-025'}>
                    {active ?
                        <div className={'br-8'} style={{ width: getProgress(startTime, endTime, now) }} /> :
                        <div className={'br-8'} style={{ width: getProgress(Number(createdAtTimestamp), startTime, now) }} />
                    }
                </div>
            )}
            {eternal && (
                <div className={'staker-event-card__reward-wrapper mb-1 flex-s-between p-05 br-8'}>
                    <span style={{ fontSize: '14px', color: 'white', textTransform: 'none', lineHeight: '19px' }}>
                        {'Overall APR:'}
                    </snap>
                    <RewardSymbol>{`${apr?.toFixed(2)}%`}</RewardSymbol>
                </div>
            )}
            {account && !active ?
                <StakeButton
                    style={{ marginTop: eternal ? '0' : '10px' }}
                    onClick={stakeHandler}
                    skeleton={skeleton}
                > Farm </StakeButton>
                : !active &&
                <StakeButton
                    onClick={toggleWalletModal}
                    skeleton={skeleton}
                > Connect Wallet </StakeButton>
            }
        </div>
    )
}
