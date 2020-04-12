import React, { Fragment } from 'react'
import { Card, TextField, Button, Box, Typography, CircularProgress } from '@material-ui/core'

import useForm from '../hooks/useForm'
import useSelector from '../hooks/useSelector'
import { useAppDispatcher } from '../hooks/useDispatcher'

import style from './style'

export default function Login() {
    const classes = style()

    const { loading } = useSelector()
    const { logIn, fetchSession } = useAppDispatcher()

    const { submit, values, errors, onChange, onBlur } = useForm({
        initialValues: {
            email: '',
            password: ''
        },
        validate: {
            email: { type: 'email', min: 3, max: 100, required: true },
            password: { type: 'any', min: 3, max: 100, required: true }
        }
    })

    const handleSubmit = submit(async (values) => {
        await logIn(values)
        fetchSession()
    })

    return (
        <Fragment>
            <Box p={2} bgcolor="grey.500" className={classes.root}>
                <Card elevation={3}>
                    <Box p={2}>
                        <form onSubmit={handleSubmit}>
                            <Box p={2} textAlign="center">
                                <Typography>Login to NestJS + ReactJS Dashboard</Typography>
                            </Box>
                            <TextField
                                name="email"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Email"
                                type="email"
                                placeholder="eg: mail@sample.com"
                                autoComplete="email"
                                value={values.email}
                                error={errors.email}
                                onChange={onChange('email')}
                                onBlur={onBlur('email')}
                            />
                            <TextField
                                name="password"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Password"
                                type="password"
                                value={values.password}
                                error={errors.password}
                                onChange={onChange('password')}
                                onBlur={onBlur('password')}
                            />
                            <Box textAlign="right">
                                <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Card>
            </Box>

            {loading ? (
                <Box className={classes.loading}>
                    <CircularProgress />
                </Box>
            ) : null}
        </Fragment>
    )
}
