const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers")

const express = require("express");

const SwollyDataSource = require("./datasources/swolly")
const { Swolly } = require("swolly-js")

const dataFolder = "public"

const swolly = new Swolly({
    dataFolder
})

swolly.authenticate({
    connectionURI: "mariadb://swolly:password@test.de/swolly",
    alter: true,
    options: {
        dialect: "mariadb"
    }
}).then(() => {
    const app = express()
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ 
            swolly: new SwollyDataSource(swolly)
        }),
        context: async ({ req }) => {
            return {
                token: req.headers && req.headers.authorization || "",
            }
        },
    })
    server.applyMiddleware({ app })

    app.use(express.static(dataFolder))

    app.listen({ port: 8080 }, () => {
        console.log("Server is running on :8080");
    });
}).catch(err => {
    console.log(err)
})

