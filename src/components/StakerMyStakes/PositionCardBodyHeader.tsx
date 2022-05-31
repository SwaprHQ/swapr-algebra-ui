import React, { useEffect, useMemo } from 'react'
import { FarmingType } from '../../models/enums'
import './index.scss'
import CurrencyLogo from '../CurrencyLogo'
import { Token } from '@uniswap/sdk-core'
import { WrappedCurrency } from '../../models/types'
import { formatAmountTokens } from '../../utils/numbers'
import { formatUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import BachelorTierIcon from '../../assets/images/bachelor-tier-icon.png'
import MasterTierIcon from '../../assets/images/master-tier-icon.png'
import ProfessorTierIcon from '../../assets/images/professor-tier-icon.png'

interface PositionCardBodyHeaderProps {
    farmingType: number;
    date: string;
    eternalFarming?: any;
    enteredInEternalFarming?: any;
    el?: any
}

export default function PositionCardBodyHeader({ el, farmingType, date, enteredInEternalFarming, eternalFarming }: PositionCardBodyHeaderProps) {

    const tierLevel = useMemo(() => {

        if (!el?.tokensLockedEternal || !el?.levelIncentive || !el?.levelEternal || !el?.tokensLockedIncentive) return

        switch (farmingType === FarmingType.FINITE ? +el?.levelIncentive : +el?.levelEternal) {
            case 0:
                return
            case 1:
                return BachelorTierIcon
            case 2:
                return MasterTierIcon
            case 3:
                return ProfessorTierIcon
            default:
                return
        }

    }, [el])

    const tierName = useMemo(() => {
        if (!el?.tokensLockedEternal || !el?.levelIncentive || !el?.levelEternal || !el?.tokensLockedIncentive) return

        switch (farmingType === FarmingType.FINITE ? +el?.levelIncentive : +el?.levelEternal) {
            case 0:
                return
            case 1:
                return 'Bachelor'
            case 2:
                return 'Master'
            case 3:
                return 'Professor'
            default:
                return
        }

    }, [el])

    const tierMultiplier = useMemo(() => {

        if (!el || !el.levelIncentive || !el.levelEternal || !el.lockedToken) return

        switch (farmingType === FarmingType.FINITE ? +el.levelIncentive : +el.levelEternal) {
            case 0:
                return
            case 1:
                return el.level1multiplier
            case 2:
                return el.level2multiplier
            case 3:
                return el.level3multiplier
            default:
                return
        }

    }, [el, farmingType])

    useEffect(() => {
        console.log(farmingType + ':')
        console.log(el)
        // console.log(tierMultiplier)
    }, [el])

    return (
        <>
            <div className={`flex-s-between b mb-1 fs-125 ${farmingType === FarmingType.ETERNAL ? 'farming-card-header ms_fd-c' : ''}`}>
                <span className={'w-100'}>{farmingType === FarmingType.FINITE ? 'Limit ' : 'Infinite '} Farming</span>
                {farmingType === FarmingType.ETERNAL && enteredInEternalFarming && eternalFarming && (
                    <span className={'fs-085 l w-100 mm_fs-075 ms_ta-l mxs_ta-l ta-r'}>
                    <span>Entered at: </span>
                    <span>{date.slice(0, -3)}</span>
                </span>
                )}
            </div>
            <div className={`flex-s-between b mb-1 fs-125 farming-card-header ms_fd-c`}>
                {(tierLevel && tierName) &&
                    <div className={'f f-ac mxs_ml-0 mxs_mv-1 ms_f-js w-100'}>
                        {/* <CurrencyLogo currency={new Token(137, el.lockedToken.id, 18, el.lockedToken.symbol) as WrappedCurrency} size={"35px"} /> */}
                        <div style={{ width: '35px', height: '35px', background: '#324e64', borderRadius: '50%' }} className={'f f-ac f-jc'}>
                            <img src={tierLevel} width={30} height={30} />
                        </div>
                        <div className={'ml-05'}>
                            <div className={'b fs-075'} style={{ marginBottom: '2px' }}>TIER</div>
                            <div>{tierName}</div>
                        </div>
                    </div>
                }
                {
                    el?.lockedToken && (+(farmingType === FarmingType.FINITE ? el?.tokensLockedIncentive : el?.tokensLockedEternal) > 0) &&
                    <div className={'f f-ac f-jc ml-2 ms_ml-0 ms_f-js ms_mv-1 mxs_mv-1 w-100'}>
                        <CurrencyLogo currency={new Token(80001, el?.lockedToken.id, 18, el?.lockedToken.symbol) as WrappedCurrency} size={'35px'} />
                        <div className={'ml-05'}>
                            <div className={'b fs-075'} style={{ marginBottom: '2px' }}>LOCKED</div>
                            <div>{`${formatAmountTokens(+formatUnits(BigNumber.from(farmingType === FarmingType.FINITE ? el?.tokensLockedIncentive : el?.tokensLockedEternal), el?.lockedToken.decimals))} ${el?.lockedToken.symbol}`}</div>
                        </div>
                    </div>
                }
                {tierMultiplier && (
                    <span className={'fs-1 l w-100 ms_ta-l ms_ta-l ta-r hide-m'}>
                    <span>Tier bonus: </span>
                    <span style={{ color: '#33FF89' }}>{`+${tierMultiplier / 100}%`}</span>
                </span>
                )}
            </div>
            {tierMultiplier && (
                <span className={'fs-1 l w-100 ms_ta-l i-f  mb-1 show-m'}>
                    <span>Tier bonus: </span>
                    <span style={{ color: '#33FF89' }}>{`+${tierMultiplier / 100}%`}</span>
                </span>
            )}
        </>
    )
}
