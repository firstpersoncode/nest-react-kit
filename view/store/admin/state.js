const fields = ['name', 'email']

const validation = {
    role: { type: 'numeric', max: 2, required: true },
    name: { type: 'alphabetic', min: 3, max: 100, required: true },
    email: { type: 'email', min: 3, max: 100, required: true },
    password: { type: 'any', min: 3, max: 100, required: true }
}

export const initialState = {
    cells: ['role', ...fields, 'created'],
    data: [],
    pagination: {
        skip: 0,
        take: 20
    },
    order: {
        orderBy: 'created',
        order: 'desc'
    },
    filter: {
        start: null,
        end: null
    },
    query: {
        q: null,
        v: null,
        options: [
            { label: 'ID', value: 'admin.publicId' },
            { label: 'Name', value: 'admin.name' },
            { label: 'Email', value: 'admin.email' },
            { label: 'Role', value: 'admin.role', type: 'select' }
        ]
    },
    selected: {},
    fields: {
        add: [...fields, 'password', 'role'],
        edit: [...fields, 'password', 'role'],
        detail: fields
    },
    validation: {
        add: validation,
        edit: {
            ...validation,
            password: { ...validation.password, required: false }
        }
    },
    mapStatus: ['Read only', 'Read and write', 'Super']
}
