import React, { useEffect } from 'react'
import {
    Paper,
    Chip,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    Button,
    Box,
    Icon,
    Grid,
    TextField,
    MenuItem,
    Typography,
    IconButton
} from '@material-ui/core'

import useSelector from '../../hooks/useSelector'
import useDispatcher from '../../hooks/useDispatcher'

import StatusButton from '../status-button'
import ActionsButton from '../actions-button'

import style from './style'
import usePagination from './usePagination'
import useOrder from './useOrder'

export default function MainPanel() {
    const classes = style()

    const {
        loading,
        table,
        cells,
        data,
        mapStatus,
        session,
        pagination: { skip, take },
        order: { order, orderBy },
        filter,
        query
    } = useSelector()

    const {
        updateData,
        fetchData,
        fetchOne,
        exportData,
        setDialog,
        setFilter,
        setQuery,
        setPagination,
        fetchSession
    } = useDispatcher(table)

    const { handleChangePage, handleChangeRowsPerPage } = usePagination()
    const { handleRequestSort } = useOrder()

    const updateRowStatus = (id) => async (status) => {
        const body = table === 'admin' ? { role: status } : { status }
        await updateData(id, body)
        fetchData()
    }

    const handleOpenDialog = (dialog, selectedId) => async (e) => {
        e.stopPropagation()
        if (selectedId) {
            await fetchOne(selectedId)
        }
        setDialog({ [dialog]: true })
    }

    const handleExportData = () => {
        if (!data.length) {
            return
        }

        exportData(data.map((row) => row.publicId))
    }

    const refreshData = async () => {
        await setPagination({ skip: 0 })
        // resetFilter && (await resetFilter())
        // resetQuery && (await resetQuery())
        fetchData()
        fetchSession()
    }

    useEffect(() => {
        if (table) {
            refreshData()
        }
    }, [table])

    return (
        <Box px={2} overflow="hidden">
            <Box py={2}>
                {session.role >= (table === 'admin' ? 2 : 1) ? (
                    <Button
                        disabled={loading}
                        margin="normal"
                        onClick={handleOpenDialog('add')}
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Icon>add</Icon>}>
                        Add {table}
                    </Button>
                ) : null}

                <Button
                    disabled={loading}
                    className={classes.marginL}
                    margin="normal"
                    onClick={handleOpenDialog('filter')}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<Icon>filter_list</Icon>}>
                    Filter
                </Button>

                {table !== 'admin' ? (
                    <Button
                        disabled={!data.length || loading}
                        className={classes.marginL}
                        margin="normal"
                        onClick={handleExportData}
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Icon>send</Icon>}>
                        Export
                    </Button>
                ) : null}

                <Button
                    disabled={!data.length || loading}
                    className={classes.marginL}
                    margin="normal"
                    onClick={refreshData}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<Icon>refresh</Icon>}>
                    Refresh
                </Button>
            </Box>
            {query.q || filter.start || filter.end ? (
                <Box className={classes.chips} mb={2}>
                    <Typography>Filter:</Typography>
                    {/* order && orderBy ? <Chip label={orderBy + ': ' + order} onDelete={() => null} /> : null */}
                    {query.q && query.v ? (
                        <Chip
                            label={query.q.toUpperCase()}
                            onDelete={async () => {
                                await setQuery({ q: '', v: '' })
                                fetchData()
                            }}
                        />
                    ) : null}
                    {Object.keys(filter)
                        .filter((f) => filter[f])
                        .map((f, i) => (
                            <Chip
                                key={i}
                                label={f.toUpperCase() + ': ' + filter[f]}
                                onDelete={async () => {
                                    await setFilter({ [f]: null })
                                    fetchData()
                                }}
                            />
                        ))}
                </Box>
            ) : null}

            <TableContainer
                component={Paper}
                elevation={3}
                className={classes.tableContainer + (loading ? ' loading' : '')}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.darkCell}>#</TableCell>
                            {cells.map((cell, k) => (
                                <TableCell
                                    sortDirection={orderBy === cell ? order : false}
                                    className={classes.darkCell}
                                    key={k}>
                                    <TableSortLabel
                                        color="primary"
                                        active={orderBy === cell}
                                        direction={orderBy === cell ? order : 'asc'}
                                        onClick={handleRequestSort(cell)}>
                                        {cell.toUpperCase()}
                                        {orderBy === cell ? (
                                            <span className={classes.visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </span>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell className={classes.darkCell} align="right">
                                <span>ACTIONS</span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length
                            ? data.map((row, i) => (
                                  <TableRow
                                      onClick={handleOpenDialog('detail', row.publicId)}
                                      className={classes.rows + [' dark', '', ' info', ' success'][row.status]}
                                      key={i}>
                                      <TableCell component="th" scope="row">
                                          <small>{i + 1 + skip}</small>
                                      </TableCell>
                                      {cells.map((cell, k) => (
                                          <TableCell key={k}>
                                              {cell === 'created' ? (
                                                  <small>{new Date(row[cell]).toUTCString()}</small>
                                              ) : cell === 'status' || cell === 'role' ? (
                                                  <StatusButton onChange={updateRowStatus(row.publicId)}>
                                                      {mapStatus[Number(row[cell])]}
                                                  </StatusButton>
                                              ) : cell === 'isVerified' ? (
                                                  <span>{!row[cell] ? 'No' : 'Yes'}</span>
                                              ) : (
                                                  <span>{row[cell]}</span>
                                              )}
                                          </TableCell>
                                      ))}
                                      <TableCell align="right">
                                          <ActionsButton
                                              onDetail={handleOpenDialog('detail', row.publicId)}
                                              onEdit={handleOpenDialog('edit', row.publicId)}
                                              onDelete={handleOpenDialog('delete', row.publicId)}
                                          />
                                      </TableCell>
                                  </TableRow>
                              ))
                            : null}
                    </TableBody>
                </Table>
            </TableContainer>

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
                        <IconButton color="primary" disabled={skip === 0 || loading} onClick={handleChangePage('prev')}>
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
        </Box>
    )
}

// function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//         return -1
//     }
//     if (b[orderBy] > a[orderBy]) {
//         return 1
//     }
//     return 0
// }
//
// function getComparator(order, orderBy) {
//     return order === 'desc'
//         ? (a, b) => descendingComparator(a, b, orderBy)
//         : (a, b) => -descendingComparator(a, b, orderBy)
// }
//
// function stableSort(array, comparator) {
//     const stabilizedThis = array.map((el, index) => [el, index])
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0])
//         if (order !== 0) return order
//         return a[1] - b[1]
//     })
//     return stabilizedThis.map((el) => el[0])
// }
