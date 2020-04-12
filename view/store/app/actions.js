export const SET_LOADING = 'APP/SET/LOADING'
export const SET_ERROR = 'APP/SET/ERROR'
export const SET_DIALOG = 'APP/SET/DIALOG'
export const SET_TABLE = 'APP/SET/TABLE'
export const SET_SESSION = 'APP/SET/SESSION'

export const setLoading = (payload) => ({ type: SET_LOADING, payload })
export const setError = (payload) => ({ type: SET_ERROR, payload })
export const setDialog = (payload) => ({ type: SET_DIALOG, payload })
export const setTable = (payload) => ({ type: SET_TABLE, payload })
export const setSession = (payload) => ({ type: SET_SESSION, payload })
