import { setLoading, setError } from '../app/actions'

import { setRows, selectedRow } from './actions'

export const fetchCustomers = () => async (dispatch, getState) => {
    const { skip, take } = getState().customer.pagination
    const { order, orderBy } = getState().customer.order
    const { start, end } = getState().customer.filter
    const { q, v } = getState().customer.query

    let params = `order=${order.toUpperCase()}&orderBy=${orderBy}`

    if (start) {
        params = params + `&start=${start.toISOString()}`
    }

    if (end) {
        params = params + `&end=${end.toISOString()}`
    }

    if (q && v) {
        params = params + `&q=${q}&v=${v}`
    }

    if (skip) {
        params = params + `&skip=${skip}`
    }

    if (take) {
        params = params + `&take=${take}`
    }

    dispatch(setLoading(true))

    try {
        const result = await fetch('/customer?' + params, {
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
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}

export const fetchCustomer = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/customer/' + id, {
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
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}

export const createCustomer = (body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/customer', {
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
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}

export const updateCustomer = (id, body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/customer/' + id, {
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
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}

export const deleteCustomer = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/customer/' + id, {
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
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}

export const inviteCustomer = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/customer/' + id + '/invite', {
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
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}

export const exportCustomer = (ids) => async (dispatch, getState) => {
    const { order, orderBy } = getState().customer.order

    dispatch(setLoading(true))

    try {
        const result = await fetch(`/customer/export?order=${order.toUpperCase()}&orderBy=${orderBy}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids
            })
        })

        if (!result.ok) {
            throw await result.json()
        }

        const file = await result.json()

        window.open('/customer/download?path=' + file.path)
        dispatch(setLoading(false))

        return file
    } catch (err) {
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}
