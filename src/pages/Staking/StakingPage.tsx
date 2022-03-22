import { SwitchLocaleLink } from "components/SwitchLocaleLink";
import { useEffect, useMemo, useState } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { useIncentiveSubgraph } from "../../hooks/useIncentiveSubgraph";
import { AlignJustify, Calendar, Zap } from "react-feather";
import { useActiveWeb3React } from "../../hooks/web3";
import { StakerMyStakes } from "../../components/StakerMyStakes";
import { FarmingEventsPage } from "../FarmingEventsPage";
import { useWalletModalToggle } from "../../state/application/hooks";
import { Helmet } from "react-helmet";
import EternalFarmsPage from "../EternalFarmsPage";
import EventsHistory from "../EventsHistory";
import { StakerMyRewards } from "../../components/StakerMyRewards";
import { FormattedRewardInterface, Reward } from "../../models/interfaces";
import Card from "../../shared/components/Card/Card";
import Menu from "../../components/Menu";
import { InfinityIcon } from "../../components/StakingMenu/styled";
import { t, Trans } from "@lingui/macro";

const stakingMenuList = [
    {
        title: t`My Farms`,
        icon: <AlignJustify size={18} />,
        link: "farms",
    },
    {
        title: t`Infinite Farms`,
        icon: <InfinityIcon size={18} />,
        link: "infinite-farms",
    },
    {
        title: t`Limit Farms`,
        icon: <Zap size={18} />,
        link: "limit-farms",
    },
    {
        title: t`Farms History`,
        icon: <Calendar size={18} />,
        link: "farms-history",
    },
];

export default function StakingPage() {
    const { account } = useActiveWeb3React();
    const { path } = useRouteMatch();
    const toggleWalletModal = useWalletModalToggle();

    const {
        fetchRewards: { rewardsResult, fetchRewardsFn, rewardsLoading },
        fetchAllEvents: { fetchAllEventsFn, allEvents, allEventsLoading },
        fetchTransferredPositions: { fetchTransferredPositionsFn, transferredPositions, transferredPositionsLoading },
        fetchEternalFarms: { fetchEternalFarmsFn, eternalFarms, eternalFarmsLoading },
    } = useIncentiveSubgraph() || {};

    const [now, setNow] = useState(Date.now());

    const formattedData = useMemo(() => {
        if (typeof rewardsResult === "string") return [];

        return rewardsResult.filter((el) => Boolean(+el.trueAmount));
    }, [rewardsResult]);

    useEffect(() => {
        const timeNow = setInterval(() => setNow(Date.now()), 1000);
        return () => {
            clearInterval(timeNow);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>
                    <Trans>Algebra — Farming</Trans>
                </title>
            </Helmet>
            <Card classes={"br-24 p-2 mm_p-1"}>
                <Menu
                    items={stakingMenuList}
                    classes={"fs-125 mb-2"}
                    refreshHandler={() => (account ? fetchTransferredPositionsFn(true) : undefined)}
                    isLoading={transferredPositionsLoading}
                    size={"17px"}
                />
                <Switch>
                    <Route exact path={`${path}`}>
                        <Redirect to={`${path}/${account ? "farms" : "limit-farms"}`} />
                    </Route>
                    <Route exact path={`${path}/farms`}>
                        <Helmet>
                            <title>
                                <Trans>Algebra — Farming • My Farms</Trans>
                            </title>
                        </Helmet>
                        {account ? (
                            <>
                                <StakerMyRewards data={formattedData as Reward[] & FormattedRewardInterface[]} refreshing={rewardsLoading} fetchHandler={() => fetchRewardsFn(true)} />
                                <StakerMyStakes
                                    data={transferredPositions}
                                    refreshing={transferredPositionsLoading}
                                    fetchHandler={() => {
                                        fetchTransferredPositionsFn(true);
                                    }}
                                    now={now}
                                />
                            </>
                        ) : (
                            <div className={"f f-ac f-jc f c h-400"}>
                                <AlignJustify size={40} stroke={"white"} />
                                <p className={"mb-1"}>
                                    <Trans>Connect your account to view farms</Trans>
                                </p>
                                <button className={"btn primary pv-05 ph-2 br-8 b"} onClick={toggleWalletModal}>
                                    <Trans>Connect Wallet</Trans>
                                </button>
                            </div>
                        )}
                    </Route>
                    <Route exact path={`${path}/limit-farms`}>
                        <Helmet>
                            <title>
                                <Trans>Algebra — Farming • Limit Farms</Trans>
                            </title>
                        </Helmet>
                        <FarmingEventsPage data={allEvents} refreshing={allEventsLoading} fetchHandler={() => fetchAllEventsFn(true)} now={now} />
                    </Route>
                    <Route exact path={`${path}/infinite-farms`}>
                        <Helmet>
                            <title>
                                <Trans>Algebra — Farming • Infinite Farms</Trans>
                            </title>
                        </Helmet>

                        <EternalFarmsPage data={eternalFarms} refreshing={eternalFarmsLoading} fetchHandler={() => fetchEternalFarmsFn(true)} />
                    </Route>
                    <Route exact strict path={`${path}/farms-history`}>
                        <Helmet>
                            <title>
                                <Trans>Algebra — Farming • Farms History history</Trans>
                            </title>
                        </Helmet>
                        <EventsHistory />
                    </Route>
                </Switch>
            </Card>
            <SwitchLocaleLink />
        </>
    );
}
