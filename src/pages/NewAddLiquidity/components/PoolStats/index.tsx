import "./index.scss";

interface IPoolStats {
    fee: string | undefined;
    apr: string | undefined;
}

export function PoolStats({ fee, apr }: IPoolStats) {
    return (
        <div className="pool-stats-wrapper f f-jb w-100">
            <div className="pool-stats__title f w-100">Pool stats</div>
            <div className="f">
                <div className="pool-stats__fee">
                    <span>{`${fee}% fee`}</span>
                </div>
                <div className="pool-stats__apr">
                    <span>{`${apr}% APR`}</span>
                </div>
            </div>
        </div>
    );
}
