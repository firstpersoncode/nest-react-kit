import React, { Fragment } from 'react'
import { Grid, Box, CircularProgress } from '@material-ui/core'

import useSelector from '../hooks/useSelector'

import MainPanel from './main-panel'
import SideBar from './side-bar'
import FilterDialog from './filter-dialog'
import AddDialog from './add-dialog'
import DeleteDialog from './delete-dialog'
import DetailDialog from './detail-dialog'
import EditDialog from './edit-dialog'

import style from './style'

export default function DashBoard() {
    const classes = style()

    const { dialog, table, loading } = useSelector()
    const dialogOpened = dialog.filter || dialog.add || dialog.detail || dialog.edit || dialog.delete
    return (
        <Fragment>
            <Grid container className={classes.wrapper + (dialogOpened ? ' blur' : '')}>
                <Grid item xs={2}></Grid>
                <Grid className={classes.fixedSideBar} item xs={2}>
                    <SideBar />
                </Grid>
                <Grid className={classes.mainWrapper} item xs={10}>
                    {loading ? (
                        <Box className={classes.loading}>
                            <CircularProgress />
                        </Box>
                    ) : null}
                    <Box className={classes.main + (loading ? ' blur' : '')}>{table ? <MainPanel /> : null}</Box>
                </Grid>
            </Grid>

            {dialog.filter ? <FilterDialog /> : null}
            {dialog.add ? <AddDialog /> : null}
            {dialog.detail ? <DetailDialog /> : null}
            {dialog.edit ? <EditDialog /> : null}
            {dialog.delete ? <DeleteDialog /> : null}
        </Fragment>
    )
}
