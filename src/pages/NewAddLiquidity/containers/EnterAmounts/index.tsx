import { TokenAmountCard } from "pages/NewAddLiquidity/components/TokenAmountCard";
import { TokenRatio } from "pages/NewAddLiquidity/components/TokenRatio";

import { Currency, CurrencyAmount, Token } from "@uniswap/sdk-core";

import "./index.scss";
import { Field } from "state/mint/actions";
import { IDerivedMintInfo, useV3MintActionHandlers, useV3MintState } from "state/mint/v3/hooks";
import useUSDCPrice, { useUSDCValue } from "hooks/useUSDCPrice";
import { maxAmountSpend } from "utils/maxAmountSpend";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "constants/addresses";
import { useActiveWeb3React } from "hooks/web3";
import { Position } from "@uniswap/v3-sdk";
import { Bound } from "state/mint/v3/actions";
import { useMemo } from "react";
import { tryParseAmount } from "state/swap/hooks";

import { MaxUint256 } from "@ethersproject/constants";
import { Check } from "react-feather";
import { StepTitle } from "pages/NewAddLiquidity/components/StepTitle";
import { PriceFormats } from "pages/NewAddLiquidity/components/PriceFomatToggler";

interface IEnterAmounts {
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    mintInfo: IDerivedMintInfo;
    isCompleted: boolean;
    additionalStep: boolean;
    priceFormat: PriceFormats;
}

export function EnterAmounts({ currencyA, currencyB, mintInfo, isCompleted, additionalStep, priceFormat }: IEnterAmounts) {
    const { chainId } = useActiveWeb3React();

    const { independentField, typedValue, startPriceTypedValue } = useV3MintState();

    const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers(mintInfo.noLiquidity);

    // get formatted amounts
    const formattedAmounts = {
        [independentField]: typedValue,
        [mintInfo.dependentField]: mintInfo.parsedAmounts[mintInfo.dependentField]?.toSignificant(6) ?? "",
    };

    const usdcValues = {
        [Field.CURRENCY_A]: useUSDCValue(mintInfo.parsedAmounts[Field.CURRENCY_A]),
        [Field.CURRENCY_B]: useUSDCValue(mintInfo.parsedAmounts[Field.CURRENCY_B]),
    };

    // get the max amounts user can add
    const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
        return {
            ...accumulator,
            [field]: maxAmountSpend(mintInfo.currencyBalances[field]),
        };
    }, {});

    const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
        return {
            ...accumulator,
            [field]: maxAmounts[field]?.equalTo(mintInfo.parsedAmounts[field] ?? "0"),
        };
    }, {});

    // check whether the user has approved the router on the tokens
    const [approvalA, approveACallback] = useApproveCallback(
        mintInfo.parsedAmounts[Field.CURRENCY_A] || tryParseAmount("1000000000000000000000", currencyA),
        chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
    );
    const [approvalB, approveBCallback] = useApproveCallback(
        mintInfo.parsedAmounts[Field.CURRENCY_B] || tryParseAmount("1000000000000000000000", currencyB),
        chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
    );

    const showApprovalA = useMemo(() => {
        if (approvalA === ApprovalState.UNKNOWN) return undefined;

        if (approvalA === ApprovalState.NOT_APPROVED) return true;

        return approvalA !== ApprovalState.APPROVED;
    }, [approvalA]);

    const showApprovalB = useMemo(() => {
        if (approvalB === ApprovalState.UNKNOWN) return undefined;

        if (approvalB === ApprovalState.NOT_APPROVED) return true;

        return approvalB !== ApprovalState.APPROVED;
    }, [approvalB]);

    const [token0Ratio, token1Ratio] = useMemo(() => {
        const currentPrice = mintInfo.price?.toSignificant(5);

        const left = mintInfo.lowerPrice.toSignificant(5);
        const right = mintInfo.upperPrice.toSignificant(5);

        if (!currentPrice) return ["0", "0"];

        if (!left && !right) return ["0", "0"];

        if (!left && right) return ["0", "100"];

        if (!right && left) return ["100", "0"];

        if (left && right && currentPrice) {
            const leftRange = +currentPrice - +left;
            const rightRange = +right - +currentPrice;

            const totalSum = +leftRange + +rightRange;

            const leftRate = (+leftRange * 100) / totalSum;
            const rightRate = (+rightRange * 100) / totalSum;

            return [String(leftRate), String(rightRate)];
        }

        return ["0", "0"];
    }, [currencyA, currencyB, mintInfo]);

    const currencyAError = useMemo(() => {
        if ((mintInfo.errorCode !== 4 && mintInfo.errorCode !== 5) || !mintInfo.errorMessage || !currencyA) return;

        const erroredToken = mintInfo.errorMessage.split(" ")[1];

        if (currencyA.wrapped.symbol === erroredToken) return mintInfo.errorMessage;

        return;
    }, [mintInfo, currencyA]);

    const currencyBError = useMemo(() => {
        if ((mintInfo.errorCode !== 5 && mintInfo.errorCode !== 4) || !mintInfo.errorMessage || !currencyB) return;

        const erroredToken = mintInfo.errorMessage.split(" ")[1];

        if (currencyB.wrapped.symbol === erroredToken) return mintInfo.errorMessage;

        return;
    }, [mintInfo, currencyB]);

    return (
        <div className="f c">
            <StepTitle title={"Enter an amounts"} isCompleted={isCompleted} step={additionalStep ? 4 : 3} />
            <div className="f mxs_fd-cr">
                <div className="f c mxs_w-100">
                    <div className="mb-1" style={{ borderRadius: "8px" }}>
                        <TokenAmountCard
                            currency={currencyA}
                            otherCurrency={currencyB}
                            value={formattedAmounts[Field.CURRENCY_A]}
                            fiatValue={usdcValues[Field.CURRENCY_A]}
                            handleInput={onFieldAInput}
                            handleMax={() => onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? "")}
                            showApproval={showApprovalA}
                            isApproving={approvalA === ApprovalState.PENDING}
                            handleApprove={approveACallback}
                            disabled={true}
                            locked={mintInfo.depositADisabled}
                            isMax={!!atMaxAmounts[Field.CURRENCY_A]}
                            error={currencyAError}
                            priceFormat={priceFormat}
                            isBase={false}
                        />
                    </div>
                    <div>
                        <TokenAmountCard
                            currency={currencyB}
                            otherCurrency={currencyA}
                            value={formattedAmounts[Field.CURRENCY_B]}
                            fiatValue={usdcValues[Field.CURRENCY_B]}
                            handleInput={onFieldBInput}
                            handleMax={() => onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? "")}
                            showApproval={showApprovalB}
                            isApproving={approvalB === ApprovalState.PENDING}
                            handleApprove={approveBCallback}
                            disabled={false}
                            locked={mintInfo.depositBDisabled}
                            isMax={!!atMaxAmounts[Field.CURRENCY_B]}
                            error={currencyBError}
                            priceFormat={priceFormat}
                            isBase={true}
                        />
                    </div>
                </div>
                <div className="full-h ml-2 mxs_ml-0 mxs_mb-2">
                    <TokenRatio currencyA={currencyA} currencyB={currencyB} token0Ratio={token0Ratio} token1Ratio={token1Ratio} />
                </div>
            </div>
        </div>
    );
}
