import { SET_LOADING, SET_ERROR, SET_DIALOG, SET_TABLE, SET_SESSION } from './actions'
import { initialState } from './state'

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_LOADING:
            return {
                ...state,
                loading: payload
            }

        case SET_ERROR:
            return {
                ...state,
                error: payload
            }

        case SET_DIALOG:
            return {
                ...state,
                dialog: {
                    ...state.dialog,
                    ...payload
                }
            }

        case SET_TABLE:
            return {
                ...state,
                table: payload
            }

        case SET_SESSION:
            return {
                ...state,
                session: {
                    ...state.session,
                    ...payload
                }
            }

        default:
            return state
    }
}
