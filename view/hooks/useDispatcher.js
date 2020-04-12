import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'

import { logOut, logIn, fetchSession } from '../store/app/effects'
import { setDialog, setTable, setError } from '../store/app/actions'
import { fetchAdmins, fetchAdmin, createAdmin, updateAdmin, deleteAdmin, clearNotifAdmin } from '../store/admin/effects'
import {
    setFilter as setFilterAdmin,
    resetFilter as resetFilterAdmin,
    setPagination as setPaginationAdmin,
    setOrder as setOrderAdmin,
    setQuery as setQueryAdmin,
    resetQuery as resetQueryAdmin
} from '../store/admin/actions'
import {
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    exportCustomer,
    inviteCustomer
} from '../store/customer/effects'
import {
    setFilter as setFilterCustomer,
    resetFilter as resetFilterCustomer,
    setPagination as setPaginationCustomer,
    setOrder as setOrderCustomer,
    setQuery as setQueryCustomer,
    resetQuery as resetQueryCustomer
} from '../store/customer/actions'
import { fetchOrders, fetchOrder, createOrder, updateOrder, deleteOrder, exportOrder } from '../store/order/effects'
import {
    setFilter as setFilterOrder,
    resetFilter as resetFilterOrder,
    setPagination as setPaginationOrder,
    setOrder as setOrderOrder,
    setQuery as setQueryOrder,
    resetQuery as resetQueryOrder
} from '../store/order/actions'
import {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    exportProduct
} from '../store/product/effects'
import {
    setFilter as setFilterProduct,
    resetFilter as resetFilterProduct,
    setPagination as setPaginationProduct,
    setOrder as setOrderProduct,
    setQuery as setQueryProduct,
    resetQuery as resetQueryProduct
} from '../store/product/actions'

export const useAppDispatcher = () =>
    mapDispatch({
        logOut,
        logIn,
        fetchSession,
        setDialog,
        setTable,
        setError
    })

export const useAdminDispatcher = () =>
    mapDispatch({
        fetchData: fetchAdmins,
        fetchOne: fetchAdmin,
        createData: createAdmin,
        updateData: updateAdmin,
        deleteData: deleteAdmin,
        setFilter: setFilterAdmin,
        resetFilter: resetFilterAdmin,

        setPagination: setPaginationAdmin,
        setOrder: setOrderAdmin,
        setQuery: setQueryAdmin,
        resetQuery: resetQueryAdmin,

        clearNotif: clearNotifAdmin
    })

export const useCustomerDispatcher = () =>
    mapDispatch({
        fetchData: fetchCustomers,
        fetchOne: fetchCustomer,
        createData: createCustomer,
        updateData: updateCustomer,
        deleteData: deleteCustomer,
        setFilter: setFilterCustomer,
        resetFilter: resetFilterCustomer,

        exportData: exportCustomer,
        invite: inviteCustomer,
        setPagination: setPaginationCustomer,
        setOrder: setOrderCustomer,
        setQuery: setQueryCustomer,
        resetQuery: resetQueryCustomer
    })

export const useOrderDispatcher = () =>
    mapDispatch({
        fetchData: fetchOrders,
        fetchOne: fetchOrder,
        createData: createOrder,
        updateData: updateOrder,
        deleteData: deleteOrder,
        setFilter: setFilterOrder,
        resetFilter: resetFilterOrder,

        exportData: exportOrder,
        setPagination: setPaginationOrder,
        setOrder: setOrderOrder,
        setQuery: setQueryOrder,
        resetQuery: resetQueryOrder
    })

export const useProductDispatcher = () =>
    mapDispatch({
        fetchData: fetchProducts,
        fetchOne: fetchProduct,
        createData: createProduct,
        updateData: updateProduct,
        deleteData: deleteProduct,
        setFilter: setFilterProduct,
        resetFilter: resetFilterProduct,

        exportData: exportProduct,
        setPagination: setPaginationProduct,
        setOrder: setOrderProduct,
        setQuery: setQueryProduct,
        resetQuery: resetQueryProduct
    })

export default (table) => {
    const mapDispatcher = {
        admin: useAdminDispatcher,
        customer: useCustomerDispatcher,
        order: useOrderDispatcher,
        product: useProductDispatcher
    }

    const selectedDispatcher = mapDispatcher[table]

    return { ...(selectedDispatcher ? selectedDispatcher() : {}), ...useAppDispatcher() }
}

function mapDispatch(dispatchers) {
    const dispatch = useDispatch()
    return bindActionCreators(dispatchers, dispatch)
}
