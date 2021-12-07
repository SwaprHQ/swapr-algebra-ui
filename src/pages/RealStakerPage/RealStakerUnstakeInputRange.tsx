import { CurrencyDropdown } from '../AddLiquidity/styled'
import styled from 'styled-components/macro'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useCurrency } from '../../hooks/Tokens'

const CurrencyInputPanelWrapper = styled.div`
  width: 92%;
  background-color: #111621;
  margin: 26px auto 32px;
  border-radius: 16px;
  padding: 21px 0 20px 24px;
  min-height: 150px;

  img {
    width: 36px;
    height: 36px;
  }

  span {
    //font-size: px;
    color: #C3C5CB;
    cursor: default;
    &:hover{
      cursor: default;
      color: #C3C5CB;
    }
  }
`
const UnstakeTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  img {
    margin-right: 10px;
  }
`

interface StakerInputRangeProps {
  baseCurrency? : any
  amountValue: string
  setAmountValue: any
  fiatValue: any
}

export default function RealStakerUnstakeInputRange ({baseCurrency, amountValue, setAmountValue, fiatValue}: StakerInputRangeProps) {

    const ALGBCurrency = useCurrency('0x0169eC1f8f639B32Eec6D923e24C2A2ff45B9DD6')

  return (
    <CurrencyInputPanelWrapper>
      <UnstakeTitle>
        <CurrencyLogo
        currency={ALGBCurrency}/>
        {baseCurrency} ALGB
      </UnstakeTitle>
      <CurrencyDropdown
        onUserInput={(e) => {setAmountValue(e)}}
        currency={baseCurrency}
        value={amountValue}
        hideInput={false}
        hideCurrency={true}
        locked={false}
        showCommonBases
        showBalance={true}
        disabled={false}
        shallow={true}
        fiatValue={fiatValue}
      />
    </CurrencyInputPanelWrapper>
  )
}