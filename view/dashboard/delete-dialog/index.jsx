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
    LinearProgress
} from '@material-ui/core'

import useSelector from '../../hooks/useSelector'
import useDispatcher from '../../hooks/useDispatcher'

import style from './style'

export default function DeleteDialog() {
    const classes = style()

    const { table, loading, selected, dialog } = useSelector()
    const { deleteData, fetchData, setDialog } = useDispatcher(table)

    const handleCloseDialog = () => {
        setDialog({ delete: false })
    }

    const handleSubmitForm = async () => {
        if (!selected.publicId) {
            return
        }

        await deleteData(selected.publicId)
        fetchData()
        setDialog({ delete: false, detail: false })
    }

    return (
        <Dialog maxWidth="sm" fullWidth open={dialog.delete} onClose={handleCloseDialog}>
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
                        {'DELETE ' + table.toUpperCase()} <strong>{selected.publicId}</strong>{' '}
                    </Typography>
                </Toolbar>
                {loading ? <LinearProgress /> : null}
            </AppBar>
            <DialogContent>
                <Typography>
                    Are you sure you wanted to delete this {table.charAt(0).toUpperCase() + table.slice(1)}?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                    disabled={!selected.publicId || loading}
                    onClick={handleSubmitForm}
                    color="primary"
                    variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}
