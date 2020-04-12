import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'

import configureStore from './store'
import App from './app.jsx'

const muiTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#FEC900'
        },
        secondary: {
            main: '#191819'
        }
        // background: {
        //     default: '#fff'
        // }
    }
})

const store = configureStore()
render(
    <Provider store={store}>
        <ThemeProvider theme={muiTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.querySelector('#root')
)
