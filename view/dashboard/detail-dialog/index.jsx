import React, { forwardRef, Fragment } from 'react'
import {
    Button,
    IconButton,
    Typography,
    Icon,
    Dialog,
    AppBar,
    Toolbar,
    DialogActions,
    DialogContent,
    LinearProgress,
    Grid,
    Card,
    CardContent,
    Box
} from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import useSelector from '../../hooks/useSelector'
import useDispatcher from '../../hooks/useDispatcher'

import style from './style'

export default function DetailDialog() {
    const classes = style()

    const { table, selected, dialog, loading, session, fields, mapStatus } = useSelector()
    const { setDialog } = useDispatcher()

    const handleCloseDialog = () => {
        setDialog({ detail: false })
    }

    const handleInvite = () => {
        if (!selected.publicId) {
            return
        }

        invite(selected.publicId)
    }

    const handleEdit = () => {
        if (!selected.publicId) {
            return
        }

        setDialog({ edit: true })
    }

    const handleDelete = () => {
        if (!selected.publicId) {
            return
        }

        setDialog({ delete: true })
    }

    return (
        <Dialog scroll="paper" maxWidth="md" fullWidth open={dialog.detail} onClose={handleCloseDialog}>
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
                    <Typography>
                        {'DETAIL ' + table.toUpperCase()}
                        {selected.publicId ? (
                            <CopyToClipboard text={selected.publicId}>
                                <Button color="primary">{selected.publicId}</Button>
                            </CopyToClipboard>
                        ) : null}
                    </Typography>

                    {session.role >= 1 ? (
                        <Fragment>
                            <Button
                                className={classes.button}
                                startIcon={<Icon>edit</Icon>}
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleEdit}>
                                Edit
                            </Button>
                            <Button
                                className={classes.button}
                                startIcon={<Icon>delete</Icon>}
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleDelete}>
                                Delete
                            </Button>
                        </Fragment>
                    ) : null}

                    {table === 'customer' && selected.publicId ? (
                        <Button
                            className={classes.button}
                            startIcon={<Icon>mail</Icon>}
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleInvite}
                            disabled={!(selected.isVerified && selected.status)}>
                            Invite
                        </Button>
                    ) : null}
                </Toolbar>
                {loading ? <LinearProgress /> : null}
            </AppBar>

            <DialogContent>
                {selected.publicId ? (
                    <Box className={classes.form + (loading ? ' loading' : '')}>
                        <Typography variant="h6">{mapStatus[selected.role] || mapStatus[selected.status]}</Typography>
                        {fields.detail.map((field, i) => {
                            const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())

                            if (field === 'orders') {
                                return (
                                    <Grid key={i} container spacing={2}>
                                        <Grid item xs={3}>
                                            <strong>{label}</strong>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Grid container spacing={2} alignItems="stretch">
                                                {selected[field] && selected[field].length
                                                    ? selected[field].map((d, i) => (
                                                          <Grid item xs={4} key={i}>
                                                              <Card className={classes.col}>
                                                                  <CardContent>
                                                                      <Typography>{mapStatus[d.status]}</Typography>
                                                                      <Typography>
                                                                          ID:{' '}
                                                                          <CopyToClipboard text={d.publicId}>
                                                                              <Button size="small">{d.publicId}</Button>
                                                                          </CopyToClipboard>
                                                                      </Typography>

                                                                      <Grid key={i} container spacing={2}>
                                                                          <Grid item xs={3}>
                                                                              <small>Items:</small>
                                                                          </Grid>
                                                                          <Grid item xs={9}>
                                                                              <ul>
                                                                                  {d.items.map((item, k) => (
                                                                                      <li key={k}>
                                                                                          {item.product.sku}:{' '}
                                                                                          <strong>{item.qty}</strong>
                                                                                      </li>
                                                                                  ))}
                                                                              </ul>
                                                                          </Grid>
                                                                      </Grid>
                                                                  </CardContent>
                                                              </Card>
                                                          </Grid>
                                                      ))
                                                    : '-'}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            }

                            if (field === 'items') {
                                return (
                                    <Grid key={i} container spacing={2}>
                                        <Grid item xs={3}>
                                            <strong>{label}</strong>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Grid container spacing={2} alignItems="stretch">
                                                {selected[field] && selected[field].length
                                                    ? selected[field].map((d, i) => (
                                                          <Grid item xs={4} key={i}>
                                                              <Card className={classes.col}>
                                                                  <CardContent>
                                                                      <Typography>{d.product.name}</Typography>
                                                                      <Typography>
                                                                          ID:{' '}
                                                                          <CopyToClipboard text={d.product.publicId}>
                                                                              <Button size="small">
                                                                                  {d.product.publicId}
                                                                              </Button>
                                                                          </CopyToClipboard>
                                                                      </Typography>
                                                                      <Typography>
                                                                          <small>SKU: {d.product.sku}</small>
                                                                      </Typography>
                                                                      <Typography>
                                                                          <small>Size: {d.product.size}</small>
                                                                      </Typography>
                                                                      <Typography>
                                                                          <small>Qty: {d.qty}</small>
                                                                      </Typography>
                                                                  </CardContent>
                                                              </Card>
                                                          </Grid>
                                                      ))
                                                    : '-'}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            }

                            if (field === 'customer') {
                                return (
                                    <Grid key={i} container spacing={2}>
                                        <Grid item xs={3}>
                                            <strong>{label}</strong>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={3}>
                                                    <strong>ID</strong>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    :
                                                    <CopyToClipboard text={selected[field].publicId}>
                                                        <Button size="small">{selected[field].publicId}</Button>
                                                    </CopyToClipboard>
                                                </Grid>
                                            </Grid>

                                            {[
                                                'name',
                                                'email',
                                                'phone',
                                                'shippingAddress',
                                                'billingAddress',
                                                'company'
                                            ].map((d, i) => (
                                                <Grid key={i} container spacing={2}>
                                                    <Grid item xs={3}>
                                                        <strong>
                                                            {d
                                                                .replace(/([A-Z])/g, ' $1')
                                                                .replace(/^./, (str) => str.toUpperCase())}
                                                        </strong>
                                                    </Grid>
                                                    <Grid item xs={9}>
                                                        : {selected[field][d] || '-'}
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                )
                            }

                            return (
                                <Grid key={i} container spacing={2}>
                                    <Grid item xs={3}>
                                        <strong>{label}</strong>
                                    </Grid>
                                    <Grid item xs={9}>
                                        : {selected[field] || '-'}
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Box>
                ) : null}
            </DialogContent>
            <DialogActions>
                {!loading && selected.publicId ? (
                    <Typography>
                        Last update : <small>{new Date(selected.updated).toUTCString()}</small>
                    </Typography>
                ) : null}
                <Button color="primary" variant="contained" onClick={handleCloseDialog}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}
