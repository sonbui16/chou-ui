import { DayPicker } from 'react-day-picker'
import { vi } from 'date-fns/locale'
import 'react-day-picker/style.css'

export function DateRangePicker({ range, onChange }) {
  return (
    <DayPicker
      mode="range"
      locale={vi}
      selected={range}
      onSelect={onChange}
      weekStartsOn={1}
      disabled={{ before: new Date() }}
      numberOfMonths={1}
      className="rdp-root"
    />
  )
}
