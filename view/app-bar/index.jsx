import React from 'react'
import { Grid, AppBar as MUIAppBar, Typography, Button, Toolbar, LinearProgress } from '@material-ui/core'

import useSelector from '../hooks/useSelector'
import { useAppDispatcher } from '../hooks/useDispatcher'

export default function AppBar() {
    const { session, loading } = useSelector()
    const { logOut } = useAppDispatcher()

    return (
        <MUIAppBar color="secondary" position="fixed">
            <Toolbar>
                <Grid container spacing={2} justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography>NestJS + ReactJS Dashboard</Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2} justify="flex-end" alignItems="center">
                            <Grid item>{session ? <Typography>{session.name}</Typography> : null}</Grid>
                            <Grid item>
                                {session.publicId ? (
                                    <Button variant="contained" color="primary" onClick={logOut}>
                                        Log Out
                                    </Button>
                                ) : null}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
            {loading ? <LinearProgress /> : null}
        </MUIAppBar>
    )
}
