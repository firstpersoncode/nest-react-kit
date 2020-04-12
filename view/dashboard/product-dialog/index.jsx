import React, { forwardRef, useState, Fragment } from 'react'
import {
    Grid,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Box,
    Typography,
    Icon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    FormControl,
    FormLabel,
    FormControlLabel,
    FormGroup,
    Checkbox
} from '@material-ui/core'
import { useSelector as useReduxSelector } from 'react-redux'

import useSelector from '../../hooks/useSelector'
import useDispatcher, { useProductDispatcher } from '../../hooks/useDispatcher'

import style from './style'

export default function ProductDialog({ items, onChange, onUpdate }) {
    const classes = style()

    const {
        product: {
            data,
            query,
            mapStatus,
            pagination: { skip, take }
        }
    } = useReduxSelector((state) => ({ product: state.product }))

    const { loading, dialog } = useSelector()
    const { setDialog } = useDispatcher()
    const { fetchData, setQuery, resetQuery, setPagination } = useProductDispatcher()

    const handleChangeQueryType = (e) => {
        const { value } = e.target
        setQuery({ q: value, v: '' })
    }

    const handleChangeQueryValue = (e) => {
        const { value } = e.target
        setQuery({ q: query.q, v: value })
    }

    const handleResetQuery = async () => {
        await setPagination({ skip: 0 })
        await resetQuery()

        fetchData()
    }

    const handleSubmitQuery = async () => {
        await setPagination({ skip: 0 })
        fetchData()
    }

    const handleChangePage = (dir) => async () => {
        let currSkip = skip
        const page = dir === 'next' ? currSkip + take : currSkip > 0 ? currSkip - take : currSkip

        await setPagination({ skip: page })
        fetchData()
    }

    const handleChangeRowsPerPage = async (e) => {
        await setPagination({ skip: 0, take: +e.target.value })
        fetchData()
    }

    const handleSelectProducts = (product) => (e) => {
        const { checked } = e.target

        if (checked) {
            return onUpdate([...items, product])
        }

        onUpdate(items.filter((item) => item.productId !== product.productId))
    }

    const handleCloseDialog = () => {
        setDialog({ product: false })
    }

    return (
        <Dialog scroll="paper" maxWidth="sm" fullWidth open={dialog.product} onClose={handleCloseDialog}>
            <DialogTitle>
                <Box>
                    <Typography>ADD ITEM</Typography>
                </Box>
                <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseDialog}>
                    <Icon>close</Icon>
                </IconButton>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                select
                                label="Filter By"
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
                                {query.options.find(
                                    (option) => option.value === query.q && option.type === 'select'
                                ) ? (
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
                                                'product.status': mapStatus.map((option, i) => (
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
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item>
                            <Button size="small" color="secondary" variant="contained" onClick={handleResetQuery}>
                                Reset Filter
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button size="small" onClick={handleSubmitQuery} color="primary" variant="contained">
                                Submit Filter
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Box>{loading ? <LinearProgress /> : null}</Box>
            </DialogTitle>
            <DialogContent>
                {data.length ? (
                    <FormControl component="fieldset" className={classes.form + (loading ? ' loading' : '')}>
                        <FormLabel component="legend">Select product:</FormLabel>
                        <FormGroup fullWidth>
                            {data.map((product, i) => (
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={10}>
                                        <FormControlLabel
                                            key={i}
                                            fullWidth
                                            control={
                                                <Checkbox
                                                    defaultChecked={Boolean(
                                                        items.find((p) => p.productId === product.publicId)
                                                    )}
                                                    checked={Boolean(
                                                        items.find((p) => p.productId === product.publicId)
                                                    )}
                                                    onChange={handleSelectProducts({
                                                        product,
                                                        productId: product.publicId,
                                                        qty: 10
                                                    })}
                                                    name={product.name}
                                                />
                                            }
                                            label={
                                                product.name +
                                                ' - ' +
                                                product.sku +
                                                ' (' +
                                                product.size +
                                                ') ' +
                                                ' - ' +
                                                product.stock
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            disabled={!items.find((p) => p.productId === product.publicId)}
                                            variant="outlined"
                                            label="Qty"
                                            type="number"
                                            onChange={onChange(product.publicId)}
                                            value={
                                                items.find((p) => p.productId === product.publicId)
                                                    ? items.find((p) => p.productId === product.publicId).qty.toString()
                                                    : '0'
                                            }
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                        </FormGroup>
                    </FormControl>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Box py={2} textAlign="right">
                    <Grid container spacing={2} justify="flex-end" alignItems="center">
                        <Grid item>
                            <TextField
                                disabled={loading}
                                fullWidth
                                select
                                variant="outlined"
                                value={take}
                                onChange={handleChangeRowsPerPage}
                                label="Rows">
                                {[...[...Array(100)].map((_, i) => (i + 1) * 10)].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <IconButton
                                color="primary"
                                disabled={skip === 0 || loading}
                                onClick={handleChangePage('prev')}>
                                <Icon>chevron_left</Icon>
                            </IconButton>

                            <Box display="inline-block" p={2}>
                                <Typography>
                                    <small>Page {Number(skip / take) + 1}</small>
                                </Typography>
                            </Box>

                            <IconButton disabled={loading} color="primary" onClick={handleChangePage('next')}>
                                <Icon>chevron_right</Icon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>

                <Button onClick={handleCloseDialog} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}
