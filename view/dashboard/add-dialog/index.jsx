import React, { forwardRef, useState, Fragment } from 'react'
import {
    IconButton,
    DialogContent,
    Typography,
    Icon,
    Dialog,
    AppBar,
    Toolbar,
    Slide,
    TextField,
    MenuItem,
    Button,
    DialogActions,
    LinearProgress
} from '@material-ui/core'

import useSelector from '../../hooks/useSelector'
import useDispatcher from '../../hooks/useDispatcher'

import Items from '../items'

import useForm from './useForm'
import style from './style'

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function AddDialog() {
    const classes = style()

    const { table, loading, dialog, mapStatus } = useSelector()
    const { setDialog } = useDispatcher(table)

    const { handleChangeItems, handleSubmitForm, fields, values, errors, validation, onChange, onBlur } = useForm()
    const handleCloseDialog = () => {
        setIsClosing(true)
    }

    const [isClosing, setIsClosing] = useState(false)

    const handleCancelClose = () => {
        setIsClosing(false)
    }

    const handleConfirmClose = () => {
        setIsClosing(false)
        setDialog({ add: false })
    }

    return (
        <Fragment>
            <Dialog
                scroll="paper"
                fullScreen
                TransitionComponent={Transition}
                open={dialog.add}
                onClose={handleCloseDialog}>
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
                        <Typography color="inherit">{'ADD ' + table.toUpperCase()}</Typography>
                    </Toolbar>
                    {loading ? <LinearProgress /> : null}
                </AppBar>
                <DialogContent>
                    <form onSubmit={handleSubmitForm} className={classes.form + (loading ? ' loading' : '')}>
                        {fields.add.map((field, i) => {
                            const textAreaInput = ['shippingAddress', 'billingAddress', 'desc', 'note']
                            const selectInput = ['status', 'role', 'size']
                            const numberInput = ['stock', 'qty']
                            const passInput = ['password']

                            const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())

                            if (field === 'items') {
                                return <Items key={i} data={values[field]} onChange={handleChangeItems} />
                            }

                            if (textAreaInput.includes(field)) {
                                return (
                                    <TextField
                                        key={i}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        label={label}
                                        multiline
                                        rows="4"
                                        onChange={onChange(field)}
                                        onBlur={onBlur(field)}
                                        error={errors[field]}
                                        helperText={errors[field] && JSON.stringify(validation.add[field])}
                                        value={values[field]}
                                        required={validation.add[field].required}
                                    />
                                )
                            }

                            if (selectInput.includes(field)) {
                                return (
                                    <TextField
                                        key={i}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        select
                                        label={label}
                                        onChange={onChange(field)}
                                        onBlur={onBlur(field)}
                                        error={errors[field]}
                                        helperText={errors[field] && JSON.stringify(validation.add[field])}
                                        value={values[field]}
                                        required={validation.add[field].required}>
                                        {field === 'size'
                                            ? ['sm', 'lg'].map((option, i) => (
                                                  <MenuItem value={option} key={i}>
                                                      {option}
                                                  </MenuItem>
                                              ))
                                            : mapStatus.map((status, i) => (
                                                  <MenuItem value={i.toString()} key={i}>
                                                      {status}
                                                  </MenuItem>
                                              ))}
                                    </TextField>
                                )
                            }

                            if (numberInput.includes(field)) {
                                return (
                                    <TextField
                                        key={i}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        label={label}
                                        onChange={onChange(field)}
                                        onBlur={onBlur(field)}
                                        error={errors[field]}
                                        helperText={errors[field] && JSON.stringify(validation.add[field])}
                                        value={values[field]}
                                        required={validation.add[field].required}
                                    />
                                )
                            }

                            if (passInput.includes(field)) {
                                return (
                                    <TextField
                                        key={i}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        type="password"
                                        label={label}
                                        onChange={onChange(field)}
                                        onBlur={onBlur(field)}
                                        error={errors[field]}
                                        helperText={errors[field] && JSON.stringify(validation.add[field])}
                                        value={values[field]}
                                        required={validation.add[field].required}
                                    />
                                )
                            }

                            return (
                                <TextField
                                    key={i}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    label={label}
                                    onChange={onChange(field)}
                                    onBlur={onBlur(field)}
                                    error={errors[field]}
                                    helperText={errors[field] && JSON.stringify(validation.add[field])}
                                    value={values[field]}
                                    required={validation.add[field].required}
                                />
                            )
                        })}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={loading} onClick={handleSubmitForm} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isClosing} onClose={handleCancelClose}>
                <DialogContent>
                    <Typography color="inherit">Closing, and all changes will be deleted, are you sure?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelClose}>No</Button>
                    <Button onClick={handleConfirmClose} color="primary" variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
