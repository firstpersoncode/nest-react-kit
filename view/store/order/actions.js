export const SET = 'ORDER/SET'
export const SELECTED = 'ORDER/SELECTED'

export const SET_FILTER = 'ORDER/SET/FILTER'
export const RESET_FILTER = 'ORDER/RESET/FILTER'

export const SET_PAGINATION = 'ORDER/SET/PAGINATION'
export const SET_ORDER = 'ORDER/SET/ORDER'
export const SET_QUERY = 'ORDER/SET/QUERY'
export const RESET_QUERY = 'ORDER/RESET/QUERY'

export const setRows = (payload) => ({ type: SET, payload })
export const selectedRow = (payload) => ({ type: SELECTED, payload })

export const setFilter = (payload) => ({ type: SET_FILTER, payload })
export const resetFilter = () => ({ type: RESET_FILTER })

export const setPagination = (payload) => ({ type: SET_PAGINATION, payload })
export const setOrder = (payload) => ({ type: SET_ORDER, payload })
export const setQuery = (payload) => ({ type: SET_QUERY, payload })
export const resetQuery = (payload) => ({ type: RESET_QUERY, payload })
