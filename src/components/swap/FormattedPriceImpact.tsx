import { Percent } from "@uniswap/sdk-core";
import { warningSeverity } from "../../utils/prices";
import { ErrorText } from "./styled";

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
    return (
        <ErrorText fontWeight={500} fontSize={14} severity={warningSeverity(priceImpact)}>
            {priceImpact ? `${priceImpact.multiply(-1).toFixed(2)}%` : "-"}
        </ErrorText>
    );
}
