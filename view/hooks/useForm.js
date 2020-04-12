import { useState } from 'react'

export const validateAlpha = (value) => {
    const regx = /^[a-zA-Z ()]+$/

    const result = regx.test(value)

    return result
}

export const validateEmail = (value) => {
    const regx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/

    const result = regx.test(value)

    return result
}

export const validateNumber = (value) => {
    const regx = /^[0-9]+$/

    const result = regx.test(value)

    return result
}

export const validateCharacters = (value) => {
    const regx = /^[a-zA-Z0-9 ()/.,_-]+$/g

    const result = regx.test(value.replace(/(\r\n|\n|\r)/gm, ''))

    return result
}

export const validator = (value, configs) => {
    const { type, required, min, max } = configs

    const typeValidator = (value) => ({
        email:
            validateEmail(value.toString()) && (min ? value.length >= min : true && max ? value.length <= max : true),
        alphabetic:
            validateAlpha(value.toString()) && (min ? value.length >= min : true && max ? value.length <= max : true),
        numeric:
            validateNumber(value.toString()) && (min ? value.length >= min : true && max ? value.length <= max : true),
        characters:
            validateCharacters(value.toString()) &&
            (min ? value.length >= min : true && max ? value.length <= max : true),
        array:
            Array.isArray(value) &&
            value.length &&
            (min ? value.length >= min : true && max ? value.length <= max : true),
        any: min ? value.length >= min : true && max ? value.length <= max : true
    })

    return Boolean(required ? value && typeValidator(value)[type] : !value || typeValidator(value)[type])
}

export default ({ initialValues, validate }) => {
    const [values, setValues] = useState(initialValues)

    const [errors, setErrors] = useState({})

    const setFieldValue = (field, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: value
        }))

        const validation = validator(value, validate[field])

        setErrors((prevErrors) => ({ ...prevErrors, [field]: !validation }))
    }

    const onChange = (field) => (e) => {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: false }))
        const { value } = e.target
        setValues((prevValues) => ({
            ...prevValues,
            [field]: value
        }))
    }

    const onBlur = (field) => () => {
        const validation = validator(values[field], validate[field])

        setErrors((prevErrors) => ({ ...prevErrors, [field]: !validation }))
    }

    const validateForm = async () => {
        let currErrors = errors
        for (const field in values) {
            const validation = validator(values[field], validate[field])

            await setErrors((prevErrors) => ({ ...prevErrors, [field]: !validation }))
            currErrors = {
                ...currErrors,
                [field]: !validation
            }
        }

        return currErrors
    }

    const submit = (cb) => async (e) => {
        e.preventDefault()

        const errors = await validateForm()

        for (const field in errors) {
            if (errors[field]) {
                return
            }
        }

        cb(values)
    }

    return {
        submit,
        onChange,
        onBlur,
        values,
        errors,
        setFieldValue
    }
}
