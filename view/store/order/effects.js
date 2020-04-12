import { setLoading, setError } from '../app/actions'

import { setRows, selectedRow } from './actions'

export const fetchOrders = () => async (dispatch, getState) => {
    const { skip, take } = getState().order.pagination
    const { order, orderBy } = getState().order.order
    const { start, end } = getState().order.filter
    const { q, v } = getState().order.query

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
        const result = await fetch('/order?' + params, {
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

export const fetchOrder = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/order/' + id, {
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

export const createOrder = (customerId, body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/order/' + customerId, {
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

export const updateOrder = (id, body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/order/' + id, {
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

export const deleteOrder = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/order/' + id, {
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

export const exportOrder = (ids) => async (dispatch, getState) => {
    const { order, orderBy } = getState().order.order

    dispatch(setLoading(true))

    try {
        const result = await fetch(`/order/export?order=${order.toUpperCase()}&orderBy=${orderBy}`, {
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

        window.open('/order/download?path=' + file.path)
        dispatch(setLoading(false))

        return file
    } catch (err) {
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}
