import useDispatcher from '../../hooks/useDispatcher'
import useSelector from '../../hooks/useSelector'

export default () => {
    const {
        table,
        order: { orderBy, order }
    } = useSelector()
    const { fetchData, setOrder } = useDispatcher(table)

    const handleRequestSort = (property) => async () => {
        const isAsc = orderBy === property && order === 'asc'

        await setOrder({ order: isAsc ? 'desc' : 'asc', orderBy: property })
        fetchData()
    }

    return { handleRequestSort }
}
