const gqlconfig = {
    autoSchemaFile: 'src/schema.graphql',
    debug: process.env.NODE_ENV === 'development',
    playground: process.env.NODE_ENV === 'development',
    context: ({ req, res }) => ({ req, res })
}

export = gqlconfig
