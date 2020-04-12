const fields = ['name', 'sku', 'size', 'stock', 'desc']

const validation = {
    status: { type: 'numeric', max: 1, required: true },
    name: { type: 'characters', min: 3, max: 100, required: true },
    sku: { type: 'characters', min: 3, max: 50, required: true },
    size: { type: 'alphabetic', max: 2, required: true },
    stock: { type: 'numeric', required: true },
    desc: { type: 'characters', min: 3, max: 255, required: false }
}

export const initialState = {
    cells: ['status', 'name', 'sku', 'stock', 'created'],
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
            { label: 'ID', value: 'product.publicId' },
            { label: 'Name', value: 'product.name' },
            { label: 'SKU', value: 'product.sku' },
            { label: 'Size', value: 'product.size', type: 'select' },
            { label: 'Status', value: 'product.status', type: 'select' }
        ]
    },
    selected: {},
    fields: {
        add: [...fields, 'status'],
        edit: [...fields, 'status'],
        detail: fields
    },
    validation: {
        add: validation,
        edit: validation
    },
    mapStatus: ['Not active', 'Active']
}
