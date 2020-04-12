import { useSelector } from 'react-redux'

export default () => {
    const appState = useSelector((state) => state.app)

    const states = useSelector((state) => ({
        admin: state.admin,
        customer: state.customer,
        product: state.product,
        order: state.order
    }))

    return { ...(appState.table ? states[appState.table] : {}), ...appState }
}
