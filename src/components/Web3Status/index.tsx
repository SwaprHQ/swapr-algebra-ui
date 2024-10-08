import { useWeb3React } from "@web3-react/core";
import useENSName from "../../hooks/useENSName";
import WalletModal from "../WalletModal";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import { Web3StatusInner } from "./Web3StatusInner";
import { Text, Web3StatusConnect } from "./styled";
import { Trans } from "@lingui/macro";

export default function Web3Status() {
    const { isActive, account } = useWeb3React();
    const { ENSName } = useENSName(account ?? undefined);

    const sortedRecentTransactions = useSortedRecentTransactions();

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);
    const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash);

    if (!isActive) {
        return (
            <Web3StatusConnect id="connect-wallet" faded={!account} disabled>
                <Text>
                    <Trans>Loading...</Trans>
                </Text>
            </Web3StatusConnect>
        );
    }

    return (
        <>
            <Web3StatusInner />
            <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
        </>
    );
}
