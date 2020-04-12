import { setLoading, setError } from '../app/actions'

import { setRows, selectedRow } from './actions'

export const fetchProducts = () => async (dispatch, getState) => {
    const { skip, take } = getState().product.pagination
    const { order, orderBy } = getState().product.order
    const { start, end } = getState().product.filter
    const { q, v } = getState().product.query

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
        const result = await fetch('/product?' + params, {
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

export const fetchProduct = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/product/' + id, {
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

export const createProduct = (body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/product', {
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

export const updateProduct = (id, body) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/product/' + id, {
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

export const deleteProduct = (id) => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const result = await fetch('/product/' + id, {
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

export const exportProduct = (ids) => async (dispatch, getState) => {
    const { order, orderBy } = getState().product.order

    dispatch(setLoading(true))

    try {
        const result = await fetch(`/product/export?order=${order.toUpperCase()}&orderBy=${orderBy}`, {
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

        window.open('/product/download?path=' + file.path)
        dispatch(setLoading(false))

        return file
    } catch (err) {
        dispatch(setLoading(false))
        dispatch(setError(err))

        throw err
    }
}
