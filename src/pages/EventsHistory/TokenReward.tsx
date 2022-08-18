import React from "react";
import CurrencyLogo from "../../components/CurrencyLogo";
import { Token } from "@uniswap/sdk-core";
import { SupportedChainId } from "../../constants/chains";
import { WrappedCurrency } from "../../models/types";

interface TokenRewardProps {
    token: { address: string; symbol: string } | null;
    reward: number | null;
}

export default function TokenReward({ token, reward }: TokenRewardProps) {
    return (
        <div className={"f f-ac"}>
            {token ? <CurrencyLogo size="2rem" currency={new Token(SupportedChainId.DOGECHAIN, token.address, 18, token.symbol) as WrappedCurrency} /> : <span className={"ml-05"}>-</span>}
            <div className={"ml-05"}>
                <div>{reward}</div>
                <div>{token?.symbol} </div>
            </div>
        </div>
    );
}
