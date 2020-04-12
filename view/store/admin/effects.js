import { setLoading, setError, setSession } from '../app/actions'

import { setRows, selectedRow } from './actions'

export const fetchAdmins = () => async (dispatch, getState) => {
    const { skip, take } = getState().admin.pagination
    const { order, orderBy } = getState().admin.order
    const { start, end } = getState().admin.filter
    const { q, v } = getState().admin.query

    let params = `skip=${skip}&take=${take}&order=${order.toUpperCase()}&orderBy=${orderBy}&start=${(
        start || new Date(1991, 1, 1, 0, 0, 0, 0)
    ).toISOString()}&end=${(end || new Date()).toISOString()}`

    if (q && v) {
        params = params + `&q=${q}&v=${v}`
    }

    dispatch(setLoading(true))

    try {
        const result = await fetch('/admin?' + params, {
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

        dispatch(setRows(data))
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setError(err))
        dispatch(setLoading(false))

        throw err
    }
}

export const fetchAdmin = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/admin/' + id, {
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
        dispatch(selectedRow(data))
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setError(err))
        dispatch(setLoading(false))

        throw err
    }
}

export const createAdmin = (body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/admin', {
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
        dispatch(selectedRow(data))
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setError(err))
        dispatch(setLoading(false))

        throw err
    }
}

export const updateAdmin = (id, body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/admin/' + id, {
            method: 'PUT',
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
        dispatch(selectedRow(data))
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setError(err))
        dispatch(setLoading(false))

        throw err
    }
}

export const deleteAdmin = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/admin/' + id, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Accept: 'application/json'
            }
        })

        if (!result.ok) {
            throw await result.json()
        }

        const data = await result.json()
        dispatch(selectedRow(data))
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setError(err))
        dispatch(setLoading(false))

        throw err
    }
}

export const clearNotifAdmin = (table, id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/admin/' + id + '/clear-notif/' + table, {
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
        const mapNotif = {
            order: 'nto',
            customer: 'ntc'
        }
        dispatch(setSession({ [mapNotif[table]]: 0 }))
        dispatch(setLoading(false))

        return data
    } catch (err) {
        dispatch(setError(err))
        dispatch(setLoading(false))

        throw err
    }
}
