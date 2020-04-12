const fields = ['name', 'phone', 'shippingAddress', 'billingAddress', 'company']

const validation = {
    status: { type: 'numeric', max: 1, required: true },
    name: { type: 'alphabetic', min: 3, max: 100, required: true },
    phone: { type: 'numeric', min: 3, max: 30, required: true },
    shippingAddress: { type: 'characters', min: 3, max: 255, required: true },
    billingAddress: { type: 'characters', min: 3, max: 255, required: true },
    company: { type: 'alphabetic', min: 3, max: 100, required: false }
}

export const initialState = {
    cells: ['status', 'name', 'email', 'isVerified', 'created'],
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
            { label: 'ID', value: 'customer.publicId' },
            { label: 'Name', value: 'customer.name' },
            { label: 'Email', value: 'customer.email' },
            { label: 'Status', value: 'customer.status', type: 'select' }
        ]
    },
    selected: {},
    fields: {
        add: ['email', ...fields, 'status'],
        edit: [...fields, 'status'],
        detail: ['email', ...fields, 'orders']
    },
    validation: {
        add: {
            email: { type: 'email', min: 3, max: 100, required: true },
            ...validation
        },
        edit: validation
    },
    mapStatus: ['Not active', 'Active']
}
