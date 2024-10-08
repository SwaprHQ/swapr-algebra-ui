import DoubleCurrencyLogo from "../DoubleLogo";
import { Token } from "@uniswap/sdk-core";
import { WrappedCurrency } from "../../models/types";
import { TYPE } from "../../theme";
import { BarChart2, ExternalLink } from "react-feather";
import { feeTierPercent } from "../../utils";
import { NavLink } from "react-router-dom";

import AlgebraConfig from "algebra.config";

export const Pool = ({ token0, token1, fee, address }: any) => {
    const poolTitle = () => {
        if (!token1 || !token0) return [];
        if (token0.symbol === "USDC") {
            return [token1.symbol, token0.symbol];
        }
        return [token0.symbol, token1.symbol];
    };
    const _poolTitle = poolTitle();

    return (
        <div className={"f f-jc f-ac"}>
            <NavLink className={"link f-ac"} to={`/info/pools/${address}`}>
                <DoubleCurrencyLogo
                    currency0={new Token(AlgebraConfig.CHAIN_PARAMS.chainId, token0?.id, 18, token0.symbol) as WrappedCurrency}
                    currency1={new Token(AlgebraConfig.CHAIN_PARAMS.chainId, token1?.id, 18, token1.symbol) as WrappedCurrency}
                    size={20}
                />
                <TYPE.label ml="8px">
                    {_poolTitle[0]}/{_poolTitle[1]}
                </TYPE.label>
            </NavLink>
            <span className={"fee-badge ml-05 mr-05"}>{feeTierPercent(+fee)}</span>
            <a className={" hover-op trans-op"} href={`${AlgebraConfig.CHAIN_PARAMS.blockExplorerURL}/address/${address}`} rel="noopener noreferrer" target="_blank">
                <ExternalLink size={16} color={"var(--white)"} />
            </a>
        </div>
    );
};
