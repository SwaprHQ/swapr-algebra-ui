import { t } from '@lingui/macro'

export function getCountdownTime(time: number, now: number) {
    const timestamp = (time * 1000 - now) / 1000
    const days = Math.floor(timestamp / (24 * 60 * 60))
    const hours = Math.floor(timestamp / (60 * 60)) % 24
    const minutes = Math.floor(timestamp / 60) % 60
    const seconds = Math.floor(timestamp) % 60

    function format(digit: number) {
        return digit < 10 ? `0${digit}` : digit
    }

    const date = t`d`

    return `${days > 0 ? `${days}${date} ` : ''}${format(hours)}:${format(minutes)}:${format(seconds)}`
}

export function convertDateTime(date: Date) {
    const h = date.getHours().toString()
    const m = date.getMinutes().toString()

    const hChars = h.split('')
    const mChars = m.split('')

    return (hChars[1] ? h : '0' + hChars[0]) + ':' + (mChars[1] ? m : '0' + mChars[0])
}
