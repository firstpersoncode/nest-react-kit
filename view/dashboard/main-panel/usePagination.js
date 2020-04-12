import useDispatcher from '../../hooks/useDispatcher'
import useSelector from '../../hooks/useSelector'

export default () => {
    const {
        table,
        pagination: { skip, take }
    } = useSelector()
    const { fetchData, setPagination } = useDispatcher(table)

    const handleChangePage = (dir) => async () => {
        let currSkip = skip
        const page = dir === 'next' ? currSkip + take : currSkip > 0 ? currSkip - take : currSkip

        await setPagination({ skip: page })
        fetchData()
    }

    const handleChangeRowsPerPage = async (e) => {
        await setPagination({ skip: 0, take: +e.target.value })
        fetchData()
    }

    return { handleChangePage, handleChangeRowsPerPage }
}
