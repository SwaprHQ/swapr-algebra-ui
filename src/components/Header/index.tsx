import { useEffect, useMemo, useState } from 'react'
import { useETHBalances } from 'state/wallet/hooks'
// @ts-ignore
import Logo from '../../assets/svg/logo.svg'
// @ts-ignore
import Logo_logo from '../../assets/svg/alg-logo-svg.svg'
import { useActiveWeb3React } from '../../hooks/web3'
import Web3Status from '../Web3Status'
import NetworkCard from './NetworkCard'
import { useIsNetworkFailed } from '../../hooks/useIsNetworkFailed'
import usePrevious from '../../hooks/usePrevious'
import { isMobile } from 'react-device-detect'
import { useAppSelector } from '../../state/hooks'
import { BalanceText } from './styled'
import './index.scss'
import { NavLink } from 'react-router-dom'

export default function Header() {
    const { startTime, eternalFarmings } = useAppSelector((state) => state.farming)
    const { account, chainId } = useActiveWeb3React()

    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

    const prevEthBalance = usePrevious(userEthBalance)

    const _userEthBalance = useMemo(() => {
        if (!userEthBalance) {
            return prevEthBalance
        }

        return userEthBalance
    }, [userEthBalance])

    const networkFailed = useIsNetworkFailed()

    const [isEvents, setEvents] = useState(false)

    let chainValue

    if (chainId === 137) {
        chainValue = 'MATIC'
    }

    useEffect(() => {
        if (startTime.trim() || eternalFarmings) {
            setEvents(true)
        }
    }, [startTime, eternalFarmings])

    return (
        <div className={'header__wrapper flex-s-between w-100 maw-1180 mv-2'}>
            <a className={'header__logo'} href='.'>
                <img
                    width={'calc(100% - 10px)'}
                    src={Logo}
                    alt='logo'
                />
            </a>
            <div className={'header__links flex-s-between'}>
                <NavLink className={'header__links__link pv-05 ph-2 br-8 hover-op'} activeClassName={'header__links__link--active'} id={`swap-nav-link`} to={'/swap'}>
                    Swap
                </NavLink>
                <NavLink
                    className={'header__links__link pv-05 ph-2 br-8 hover-op'}
                    id={`pool-nav-link`}
                    to={'/pool'}
                    isActive={(match, { pathname }) =>
                        Boolean(match) ||
                        pathname.startsWith('/add') ||
                        pathname.startsWith('/remove') ||
                        pathname.startsWith('/increase') ||
                        pathname.startsWith('/find')
                    }
                    activeClassName={'header__links__link--active'}
                >
                    Pool
                </NavLink>
                <NavLink className={'header__links__link pv-05 ph-2 br-8 hover-op'} activeClassName={'header__links__link--active'} id={`farming-nav-link`} to={'/farming'}>
                    <span>Farming</span>
                    <span className={'header__farming-circle'} />
                </NavLink>
                <NavLink className={'header__links__link pv-05 ph-2 br-8 hover-op'} activeClassName={'header__links__link--active'} id={`staking-nav-link`} to={'/staking'}>
                    Staking
                </NavLink>
                <NavLink className={'header__links__link pv-05 ph-2 br-8 hover-op'} activeClassName={'header__links__link--active'} id={`info-nav-link`} to={'/info'}>
                    Info
                </NavLink>
            </div>

            <div className={'header__account flex-s-between pv-05 ph-1 br-8'}>
                {account &&
                    <>
                        <NetworkCard />
                        {chainId === 137 && account && userEthBalance || networkFailed ? (
                            <BalanceText
                                style={{ flexShrink: 0 }}
                                pl='0.75rem'
                                fontWeight={500}
                            >
                                {_userEthBalance?.toSignificant(3)} {!isMobile && chainValue}
                            </BalanceText>
                        ) : null}
                    </>}
                <Web3Status />
            </div>
        </div>
    )
}
