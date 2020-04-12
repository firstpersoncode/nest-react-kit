import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

export default function DatePicker({ label, value, onChange }) {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                fullWidth
                margin="normal"
                variant="outlined"
                label={label}
                format="dd/MM/yyyy"
                value={value}
                onChange={onChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date'
                }}
            />
        </MuiPickersUtilsProvider>
    )
}
