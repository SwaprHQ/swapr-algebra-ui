import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk/dist/";
import { TokenAddressMap } from "../state/lists/hooks";

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value);
    } catch {
        return false;
    }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
    const parsed = isAddress(address);
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// account is not optional
function getSigner(provider: Web3Provider, account: string): JsonRpcSigner {
    return provider.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(provider: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
    return account ? getSigner(provider, account) : provider;
}

// account is optional
export function getContract(address: string, ABI: any, provider: Web3Provider, account?: string): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(address, ABI, getProviderOrSigner(provider, account) as any);
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function isTokenOnList(tokenAddressMap: TokenAddressMap, token?: Token): boolean {
    return Boolean(token?.isToken && tokenAddressMap[token.chainId]?.[token.address]);
}

export function formattedFeeAmount(feeAmount: FeeAmount): number {
    return feeAmount / 10000;
}

export function feeTierPercent(fee: number): string {
    return (fee / 10000).toFixed(4) + "%";
}
