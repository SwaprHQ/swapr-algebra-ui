import { formatEther } from "ethers/lib/utils";
import { useCallback, useState } from "react";
import { AmountTitle } from "./styled";
import { BigNumber } from "@ethersproject/bignumber";
import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import "./index.scss";
import { Info } from "react-feather";
import Loader from "../../components/Loader";
import { t, Trans } from "@lingui/macro";

interface ResBloksProps {
    title: string;
    amount: BigNumber;
    currency: CurrencyAmount<Token> | null;
    action: string;
    handler?: any;
    algbCourse: BigNumber;
    loading: boolean;
}

export default function RealStakerResBlocks({ title, amount, currency, action, handler, algbCourse, loading }: ResBloksProps) {
    const [isFull, setIsFull] = useState(false);
    const [show, setShow] = useState(false);
    const open = useCallback(() => setShow(true), [setShow]);
    const close = useCallback(() => setShow(false), [setShow]);

    return (
        <div className={"res-wrapper br-12 mxs_m-0"}>
            <div className={"flex-s-between"}>
                <h2>{title}</h2>
                {action === "Claim" && (
                    <div onMouseEnter={open} onMouseLeave={close} style={{ position: "relative", zIndex: 5 }}>
                        <Info size={"1rem"} stroke={"white"} />
                    </div>
                )}
                {action === "Claim" && show && (
                    <div className={"earned-badge br-12"}>
                        <Trans>Any rewards you earned will be automatically restaked (compounded) for you.</Trans>
                    </div>
                )}
            </div>
            {isFull && !(formatEther(amount) < formatEther(algbCourse)) ? <AmountTitle title={`${formatEther(amount)}`}>{formatEther(amount)}</AmountTitle> : null}
            <h3 onMouseEnter={() => setIsFull(true)} onMouseLeave={() => setIsFull(false)}>
                {formatEther(amount) < formatEther(algbCourse) ? "0.00" : parseFloat(formatEther(amount)).toFixed(2)} ALGB
            </h3>
            <p className={"c-lg"}>$ {currency === null || formatEther(amount) < formatEther(algbCourse) ? "0" : currency?.toSignificant(6, { groupSeparator: "," })}</p>
            <button className={"btn primary w-100 p-05 mt-1 br-8"} disabled={+formatEther(amount) === 0 || formatEther(amount) < formatEther(algbCourse) || loading} onClick={handler}>
                {loading ? (
                    <div className={"f f-ac f-jc"}>
                        <Loader stroke={"var(--white)"} size={"1rem"} />
                        <span className={"ml-05"}>{action === "Claim" ? t`Claiming` : t`Unstaking`}</span>
                    </div>
                ) : (
                    action
                )}
            </button>
        </div>
    );
}
