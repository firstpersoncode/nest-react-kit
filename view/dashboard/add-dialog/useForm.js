import useSelector from '../../hooks/useSelector'
import useDispatcher from '../../hooks/useDispatcher'
import useForm from '../../hooks/useForm'

export default () => {
    const { table, fields, validation } = useSelector()
    const { fetchData, fetchOne, createData, setDialog } = useDispatcher(table)

    let initialValues = {}
    for (const field of fields.add) {
        initialValues = {
            ...initialValues,
            [field]: field !== 'items' ? '' : []
        }
    }

    const { submit, values, errors, onChange, onBlur, setFieldValue } = useForm({
        initialValues,
        validate: validation.add
    })

    const handleChangeItems = (updateItems) => {
        setFieldValue('items', updateItems)
    }

    const handleSubmitForm = submit(async (values) => {
        const intFields = ['status', 'role', 'stock', 'qty']
        const copyValues = Object.assign({}, values)
        let body = { ...copyValues }

        for (const field in body) {
            if (!body[field]) {
                delete body[field]
            }

            if (field === 'items') {
                body = {
                    ...body,
                    [field]: body[field].map((item) => {
                        for (const field in item) {
                            if (intFields.includes(field)) {
                                item = {
                                    ...item,
                                    [field]: Number(item[field])
                                }
                            }
                        }

                        return item
                    })
                }
            }

            if (intFields.includes(field)) {
                body = {
                    ...body,
                    [field]: Number(body[field])
                }
            }
        }

        let result
        if (table !== 'order') {
            result = await createData(body)
        } else {
            const customerId = body.customerId
            delete body.customerId
            result = await createData(customerId, body)
        }
        setDialog({ add: false, detail: true })
        fetchData()
        fetchOne(result.publicId)
    })

    return {
        handleChangeItems,
        handleSubmitForm,
        values,
        errors,
        validation,
        onChange,
        onBlur,
        fields,
        table
    }
}
