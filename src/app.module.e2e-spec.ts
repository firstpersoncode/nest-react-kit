import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing'
import { GraphQLModule } from '@nestjs/graphql'

import { AppModule } from './app.module'

describe('AppController (e2e)', () => {
    let app: INestApplication
    let apolloClient: ApolloServerTestClient

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()

        const module: GraphQLModule = moduleFixture.get<GraphQLModule>(GraphQLModule)
        // apolloServer is protected, we need to cast module to any to get it
        apolloClient = createTestClient((module as any).apolloServer)
    })

    it('Should be able to use apolloClientTest', async () => {
        const { query } = apolloClient
        const result: any = await query({
            query: `query {
                users {
                  id
                  status
                  email
                  company
                  orders {
                      note
                      id
                      items {
                          qty
                          product {
                              sku
                          }
                      }
                  }
                }

                products {
                    id
                    sku
                    size
                    stock
                }
            }`,
            variables: {}
        })
        expect(result.data).toEqual({ users: [], products: [] })
    })

    it('Should be able to create dummy data', async () => {
        const { mutate } = apolloClient
        const result: any = await mutate({
            mutation: `mutation {
                userCreate(user:{
                    name:"Doe",
                    phone:"1234567890",
                    email:"doe@dev.com",
                    shippingAddress:"Bandung",
                    billingAddress:"Surabaya"
                }) {
                    name
                    status
                }

                zigZag: productCreate(product:{
                    name:"Zig Zag Potato Chips (large)",
                    size:"l",
                    sku:"zig-zag-l",
                    stock:100,
                    desc:"The best and thicker salted egg potato chip"
                }) {
                    sku
                    stock
                }
                zigZagSmall: productCreate(product:{
                    name:"Zig Zag Potato Chips (small)",
                    size:"s",
                    sku:"zig-zag-s",
                    stock:100,
                    desc:"The best and thicker salted egg potato chip"
                }) {
                    sku
                    stock
                }
                potato: productCreate(product:{
                    name:"Potato Chips (large)",
                    size:"l",
                    sku:"potato-l",
                    stock:100,
                    desc:"The best salted egg potato chip"
                }) {
                    sku
                    stock
                }
            }`,
            variables: {}
        })

        expect(result.data).toEqual({
            userCreate: { name: 'Doe', status: 0 },
            zigZag: { sku: 'zig-zag-l', stock: 100 },
            zigZagSmall: { sku: 'zig-zag-s', stock: 100 },
            potato: { sku: 'potato-l', stock: 100 }
        })
    })

    it('Should be able to populate dummy data', async () => {
        const { query } = apolloClient
        const result: any = await query({
            query: `query {
                users {
                  status
                  email
                  company
                  orders {
                      note
                      items {
                          qty
                          product {
                              sku
                          }
                      }
                  }
                }

                products {
                    sku
                    size
                    stock
                }
            }`,
            variables: {}
        })

        expect(result.data).toEqual({
            users: [
                {
                    status: 0,
                    email: 'doe@dev.com',
                    company: '',
                    orders: []
                }
            ],
            products: [
                {
                    sku: 'zig-zag-l',
                    size: 'l',
                    stock: 100
                },
                {
                    sku: 'zig-zag-s',
                    size: 's',
                    stock: 100
                },
                {
                    sku: 'potato-l',
                    size: 'l',
                    stock: 100
                }
            ]
        })
    })

    it('Should be able to update user status', async () => {
        const { query, mutate } = apolloClient
        const queryResult: any = await query({
            query: `query {
                users {
                  id
                  status
                }
            }`,
            variables: {}
        })

        const updateUserStatus: any = await mutate({
            mutation: `mutation {
                userUpdateStatus(id:"${queryResult.data.users[0].publicId}",status:1) {
                    status
                }
            }`,
            variables: {}
        })

        expect(updateUserStatus.data).toEqual({
            userUpdateStatus: {
                status: 1
            }
        })
    })

    it('Should be able to create dummy order', async () => {
        const { query, mutate } = apolloClient
        const queryResult: any = await query({
            query: `query {
                users {
                  id
                  status
                }

                products {
                    id
                }
            }`,
            variables: {}
        })

        const createOrder: any = await mutate({
            mutation: `mutation {
                orderCreate(userId:"${queryResult.data.users[0].publicId}",order:{
                    note:"My first order",
                    items:[{
                        productId:"${queryResult.data.products[0].publicId}",
                        qty:60
                    }]
                }) {
                    status
                }
            }`,
            variables: {}
        })

        expect(createOrder.data).toEqual({
            orderCreate: {
                status: 0
            }
        })
    })
})
