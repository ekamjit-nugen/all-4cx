import { DateRangePicker as RSuiteDateRangePicker, Stack } from 'rsuite';
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import 'rsuite/DateRangePicker/styles/index.css';
import { format } from 'date-fns';

const predefinedRanges = [
  {
    label: 'Today',
    value: [new Date(), new Date()],
    placement: 'left'
  },
  {
    label: 'This week',
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: 'left'
  },
  {
    label: 'This month',
    value: [startOfMonth(new Date()), new Date()],
    placement: 'left'
  },
  {
    label: 'Last month',
    value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
    placement: 'left'
  },
  {
    label: 'This year',
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: 'left'
  },
  {
    label: 'Last year',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
    placement: 'left'
  },
  // {
  //   label: 'All time',
  //   value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
  //   placement: 'left'
  // },
  {
    label: 'Clear',
    value: null,
    placement: 'left'
  },
];


const DateRangePicker = ({selectedRange,onChange}) => (
  <Stack direction="column" spacing={10} alignItems="flex-start">
    <RSuiteDateRangePicker
      ranges={predefinedRanges}
      placeholder="Select Date"
      style={{ width: 300 }}
      onShortcutClick={(shortcut, event) => {
      }}
      
      value={selectedRange}
      onChange={onChange}
      renderValue={(value) => 
        value && value.length === 2
          ? `${format(value[0], 'MMMM d, yyyy')} - ${format(value[1], 'MMMM d, yyyy')}`
          : 'Select Date'
      }    />
  </Stack>
);

export default DateRangePicker