import { AbstractConnector } from '@web3-react/abstract-connector'
// @ts-ignore
import INJECTED_ICON_URL from '../assets/images/arrow-right.svg'
// @ts-ignore
import METAMASK_ICON_URL from '../assets/svg/metamask-logo.svg'
import { injected } from '../connectors'

interface WalletInfo {
    connector?: AbstractConnector
    name: string
    iconURL: string
    description: string
    href: string | null
    color: string
    primary?: true
    mobile?: true
    mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
        connector: injected,
        name: 'Injected',
        iconURL: INJECTED_ICON_URL,
        description: 'Injected web3 provider.',
        href: null,
        color: '#010101',
        primary: true
    },
    METAMASK: {
        connector: injected,
        name: 'MetaMask',
        iconURL: METAMASK_ICON_URL,
        description: '',
        href: null,
        color: '#E8831D'
    }
}
