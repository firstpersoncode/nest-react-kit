import React, { useEffect, forwardRef, Fragment } from 'react'
import { Box, CssBaseline, Dialog } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

import useSelector from './hooks/useSelector'
import { useAppDispatcher } from './hooks/useDispatcher'

import AppBar from './app-bar'
import Dashboard from './dashboard'
import Login from './login'

export default function App() {
    const { error, session } = useSelector()
    const { setError, fetchSession } = useAppDispatcher()

    const handleCloseMessage = () => {
        setError(null)
    }

    useEffect(() => {
        fetchSession()
    }, [])

    return (
        <Fragment>
            <CssBaseline />
            <AppBar />
            {session.publicId ? <Dashboard /> : <Login />}
            <Dialog maxWidth="sm" fullWidth open={Boolean(error && error.statusCode)} onClose={handleCloseMessage}>
                <Box p={2}>
                    <Alert severity={error ? (error.statusCode >= 400 ? 'error' : 'warning') : 'success'}>
                        <AlertTitle>{error ? 'Oops.. Something went wrong' : 'Success'}</AlertTitle>
                        {error ? <small>{error.message}</small> : null}
                    </Alert>
                </Box>
            </Dialog>
        </Fragment>
    )
}
