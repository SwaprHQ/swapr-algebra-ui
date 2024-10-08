import { Currency } from "@uniswap/sdk-core";
import { ExtendedEther, WXDAI_EXTENDED } from "../constants/tokens";
import { supportedChainId } from "./supportedChainId";

export function unwrappedToken(currency: Currency): Currency {
    if (currency.isNative) return currency;
    const formattedChainId = supportedChainId(currency.chainId);
    if (formattedChainId && currency.equals(WXDAI_EXTENDED[formattedChainId])) return ExtendedEther.onChain(currency.chainId);
    return currency;
}
