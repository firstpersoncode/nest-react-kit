import 'date-fns'
import React, { forwardRef } from 'react'
import {
    Button,
    IconButton,
    DialogContent,
    Typography,
    Icon,
    Dialog,
    AppBar,
    Toolbar,
    DialogActions,
    Grid,
    TextField,
    MenuItem
} from '@material-ui/core'
import { useSelector as useReduxSelector } from 'react-redux'

import useSelector from '../../hooks/useSelector'
import useDispatcher from '../../hooks/useDispatcher'
import DatePicker from '../date-picker'
import TimePicker from '../time-picker'

import style from './style'

export default function FilterDialog() {
    const classes = style()

    const { table, filter, dialog, query } = useSelector()
    const { setFilter, resetFilter, setDialog, fetchData, setQuery, resetQuery, setPagination } = useDispatcher(table)
    const { mapStatusAdmin, mapStatusCustomer, mapStatusProduct, mapStatusOrder } = useReduxSelector((state) => ({
        mapStatusAdmin: state.admin.mapStatus,
        mapStatusCustomer: state.customer.mapStatus,
        mapStatusProduct: state.product.mapStatus,
        mapStatusOrder: state.order.mapStatus
    }))

    const handleChangeQueryType = (e) => {
        const { value } = e.target
        setQuery({ q: value, v: '' })
    }

    const handleChangeQueryValue = (e) => {
        const { value } = e.target
        setQuery({ q: query.q, v: value })
    }

    const handleChangeFilterDate = (type) => (date) => {
        setFilter({ [type]: date })
    }

    const handleResetForm = async () => {
        await resetFilter()
        await resetQuery()
        await setPagination({ skip: 0 })
        fetchData()

        setDialog({ filter: false })
    }

    const handleSubmitForm = async () => {
        await setPagination({ skip: 0 })
        fetchData()

        setDialog({ filter: false })
    }

    const handleCloseDialog = () => {
        setDialog({ filter: false })
    }

    return (
        <Dialog scroll="paper" maxWidth="md" fullWidth open={dialog.filter} onClose={handleCloseDialog}>
            <AppBar className={classes.header} color="secondary">
                <Toolbar>
                    <IconButton
                        className={classes.closeButton}
                        color="inherit"
                        edge="end"
                        onClick={handleCloseDialog}
                        aria-label="close">
                        <Icon>close</Icon>
                    </IconButton>
                    <Typography>FILTER</Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <DatePicker
                            value={filter.start}
                            label="Start date"
                            onChange={handleChangeFilterDate('start')}
                        />
                        <TimePicker
                            value={filter.start}
                            label="Start time"
                            onChange={handleChangeFilterDate('start')}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <DatePicker value={filter.end} label="End date" onChange={handleChangeFilterDate('end')} />
                        <TimePicker value={filter.end} label="End time" onChange={handleChangeFilterDate('end')} />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            select
                            label="Filter by"
                            onChange={handleChangeQueryType}
                            value={query.q}>
                            {query.options.map((option, i) => (
                                <MenuItem value={option.value} key={i}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {query.q ? (
                        <Grid item xs={6}>
                            {query.options.find((option) => option.value === query.q && option.type === 'select') ? (
                                <TextField
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    select
                                    label="Value"
                                    onChange={handleChangeQueryValue}
                                    value={query.v}>
                                    {
                                        {
                                            'admin.role': mapStatusAdmin.map((option, i) => (
                                                <MenuItem value={i.toString()} key={i}>
                                                    {option}
                                                </MenuItem>
                                            )),
                                            'customer.status': mapStatusCustomer.map((option, i) => (
                                                <MenuItem value={i.toString()} key={i}>
                                                    {option}
                                                </MenuItem>
                                            )),
                                            'product.status': mapStatusProduct.map((option, i) => (
                                                <MenuItem value={i.toString()} key={i}>
                                                    {option}
                                                </MenuItem>
                                            )),
                                            'order.status': mapStatusOrder.map((option, i) => (
                                                <MenuItem value={i.toString()} key={i}>
                                                    {option}
                                                </MenuItem>
                                            )),
                                            'product.size': ['sm', 'lg'].map((option, i) => (
                                                <MenuItem value={option} key={i}>
                                                    {option}
                                                </MenuItem>
                                            ))
                                        }[query.q]
                                    }
                                </TextField>
                            ) : (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label="Value"
                                    onChange={handleChangeQueryValue}
                                    value={query.v}
                                    InputProps={{
                                        startAdornment: <Icon>search</Icon>
                                    }}
                                    margin="normal"
                                />
                            )}
                        </Grid>
                    ) : (
                        <Grid item xs={6}>
                            <TextField fullWidth margin="normal" disabled={true} label="Value" />
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button color="secondary" variant="contained" onClick={handleResetForm}>
                    Reset
                </Button>
                <Button onClick={handleSubmitForm} color="primary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}
