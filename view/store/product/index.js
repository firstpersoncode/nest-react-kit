import { SET, SELECTED, SET_FILTER, RESET_FILTER, SET_PAGINATION, SET_ORDER, SET_QUERY, RESET_QUERY } from './actions'
import { initialState } from './state'

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET:
            return {
                ...state,
                data: payload
            }

        case SELECTED:
            return {
                ...state,
                selected: payload
            }

        case SET_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    ...payload
                }
            }

        case RESET_FILTER:
            return {
                ...state,
                filter: initialState.filter
            }

        case SET_PAGINATION:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    ...payload
                }
            }

        case SET_ORDER:
            return {
                ...state,
                order: {
                    ...state.order,
                    ...payload
                }
            }

        case SET_QUERY:
            return {
                ...state,
                query: {
                    ...state.query,
                    ...payload
                }
            }

        case RESET_QUERY:
            return {
                ...state,
                query: initialState.query
            }

        default:
            return state
    }
}
