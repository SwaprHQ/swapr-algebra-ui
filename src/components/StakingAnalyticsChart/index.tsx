import styled from 'styled-components/macro'
import Chart from './Chart'
import {useCallback, useEffect, useMemo, useState} from 'react'
import * as d3 from 'd3'
import Brush from './Brush'
import {BigNumber} from 'ethers'
import {formatEther} from 'ethers/lib/utils'
import {isMobile} from 'react-device-detect'

const StakingAnalyticsChartWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  background-color: #313644;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 2rem 0;
`

export function convertDate(date: Date) {
    const yyyy = date.getFullYear().toString()
    const mm = (date.getMonth() + 1).toString()
    const dd = date.getDate().toString()

    const mmChars = mm.split('')
    const ddChars = dd.split('')

    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0])
}

interface StakingAnalyticsChartProps {
    stakeHistoriesResult: any[] | null
    type: string
}

export interface ChardDataInterface {
    value: string
    date: string
}

export default function StakingAnalyticsChart({stakeHistoriesResult, type}: StakingAnalyticsChartProps) {
    const [chartData, setChartData] = useState([])
    const [chartBorder, setChartBorder] = useState([])
    const focusHeight = 70
    const dimensions = {width: isMobile ? 600 : 900, height: 400}
    const margin = {left: 50, top: 30, right: 30, bottom: 30}
    const borderedData: ChardDataInterface[] = []

    const getDaysArray = useCallback((start, end) => {
        const arr = []
        const dt = new Date(start)

        while (dt <= end) {
            arr.push(convertDate(dt))
            dt.setDate(dt.getDate() + 1)
        }
        return arr
    }, [])

    useEffect(() => {
        if (stakeHistoriesResult) {
            if (type === 'apr') {
                setChartData(stakeHistoriesResult.map(item => {
                    return {
                        value: formatEther(BigNumber.from(item.earned).div(BigNumber.from(item.currentStakedAmount))) * 365 * 100,
                        date: convertDate(new Date(item.date * 1000))
                    }
                }))
            } else {
                setChartData(stakeHistoriesResult.map(item => {
                    return {
                        value: formatEther(BigNumber.from(item[type])._hex),
                        date: convertDate(new Date(item.date * 1000))
                    }
                }))
            }
        }
    }, [stakeHistoriesResult])

    let prevData = ''
    const fullDateData = useMemo(() => getDaysArray(d3.min(chartData)?.date, new Date()).map(item => {
        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].date === item) {
                prevData = chartData[i].value
                return chartData[i]
            }
        }
        if (type === 'xALGBtotalSupply') {
            return {value: prevData, date: item}
        }
        return {value: '0', date: item}
    }), [chartData])

    fullDateData.map(item => {
        if (item.date >= chartBorder[0] && item.date <= chartBorder[1]) {
            borderedData.push(item)
        }
    })

    const X = useMemo(() => d3.map(fullDateData, d => new Date(d.date)), [fullDateData])

    return (
        <StakingAnalyticsChartWrapper>
            <Chart
                data={borderedData}
                margin={margin}
                dimensions={dimensions}
            />
            <Brush
                data={fullDateData}
                width={dimensions.width}
                margin={margin}
                focusHeight={focusHeight}
                X={X}
                updateChartData={setChartBorder}/>
        </StakingAnalyticsChartWrapper>
    )
}