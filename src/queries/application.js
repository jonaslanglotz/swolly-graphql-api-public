const { Errors: SwollyErrors } = require("swolly-js");

const Errors = {
    Internal: () => ({
        success: false,
        code: "INTERNAL",
    }),
    NotAuthorized: () => ({
        success: false,
        code: "NOT_AUTHORIZED",
    }),
    ApplicationNotFound: msg => ({
        success: false,
        code: "APPLICATION_NOT_FOUND",
        message: msg
    }),
}

module.exports = {
    definition: "application(id: ID!): ApplicationResponse",
    schema: `
        type ApplicationResponse {
            success: Boolean!
            code: ApplicationResponseCode
            message: String
            application: Application
        }

        enum ApplicationResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        const { id } = args

        try {
            const application = await swolly.Application.get(context.token, id)
            if(application == null || application.getData() === null) { 
                return Errors.ApplicationNotFound()
            }

            return {
                success: true,
                application: application.getData()
            }
        } catch(err) {
            console.log(err)
            return Errors.Internal()
        }

    },
    errors: Errors
}



