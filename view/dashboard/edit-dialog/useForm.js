import useSelector from '../../hooks/useSelector'
import useDispatcher from '../../hooks/useDispatcher'
import useForm from '../../hooks/useForm'

export default () => {
    const { table, fields, validation, selected } = useSelector()
    const { fetchData, fetchOne, updateData, setDialog } = useDispatcher(table)

    let initialValues = {}
    for (const field of fields.edit) {
        initialValues = {
            ...initialValues,
            [field]: typeof selected[field] === 'number' ? String(selected[field]) : selected[field]
        }
    }

    const { submit, values, errors, onChange, onBlur, setFieldValue } = useForm({
        initialValues,
        validate: validation.edit
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

        const result = await updateData(selected.publicId, body)
        setDialog({ edit: false, detail: true })
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
