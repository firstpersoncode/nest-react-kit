const fields = ['note', 'items']

const validation = {
    status: { type: 'numeric', max: 1, required: true },
    items: { type: 'array', min: 1, required: true },
    note: { type: 'characters', min: 3, max: 255, required: false }
}

export const initialState = {
    cells: ['status', 'created'],
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
            { label: 'ID', value: 'order.publicId' },
            { label: 'Status', value: 'order.status', type: 'select' },
            { label: 'Customer ID', value: 'customer.publicId' },
            { label: 'Customer Name', value: 'customer.name' },
            { label: 'Customer Email', value: 'customer.email' },
            { label: 'Customer Status', value: 'customer.status', type: 'select' },
            { label: 'Product ID', value: 'product.publicId' },
            { label: 'Product Name', value: 'product.name' },
            { label: 'Product SKU', value: 'product.sku' },
            { label: 'Product Status', value: 'product.status', type: 'select' }
        ]
    },
    selected: {},
    fields: {
        add: ['customerId', ...fields, 'status'],
        edit: [...fields, 'status'],
        detail: ['customer', ...fields]
    },
    validation: {
        add: {
            customerId: { type: 'any', min: 3, max: 255, required: true },
            ...validation
        },
        edit: validation
    },
    mapStatus: ['Waiting', 'Processing', 'Shipping', 'Delivered']
}
