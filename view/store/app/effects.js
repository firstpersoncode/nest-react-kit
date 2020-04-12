import { setSession, setLoading, setError } from './actions'

export const fetchSession = () => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/auth/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json'
            }
        })

        if (!result.ok) {
            throw await result.json()
        }

        const data = await result.json()
        dispatch(setSession(data))
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setLoading(false))
        dispatch(setError({ statusCode: 302, message: 'Session required' }))
        dispatch(
            setSession({
                publicId: '',
                role: null,
                name: '',
                email: ''
            })
        )
        throw err
    }
}

export const logIn = (body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        if (!result.ok) {
            throw await result.json()
        }

        const data = await result.json()
        dispatch(setSession(data))
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}

export const logOut = () => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/auth/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json'
            }
        })

        if (!result.ok) {
            throw await result.json()
        }

        const data = await result.json()
        dispatch(
            setSession({
                publicId: '',
                role: null,
                name: '',
                email: ''
            })
        )
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}
