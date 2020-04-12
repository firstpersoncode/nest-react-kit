import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import appReducer from './app'
import adminReducer from './admin'
import customerReducer from './customer'
import productReducer from './product'
import orderReducer from './order'

export default () => {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
        (require('redux-devtools-extension') && require('redux-devtools-extension').composeWithDevTools({})) ||
        compose

    const store = createStore(
        combineReducers({
            app: appReducer,
            admin: adminReducer,
            customer: customerReducer,
            product: productReducer,
            order: orderReducer
        }),
        {},
        composeEnhancers(applyMiddleware(thunk))
    )

    return store
}
