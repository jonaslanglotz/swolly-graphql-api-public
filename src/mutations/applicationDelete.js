const { Errors: SwollyErrors, Enums, Model } = require("swolly-js");

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
    definition: "applicationDelete(id: ID!): ApplicationDeleteResponse!",
    schema: `
        type ApplicationDeleteResponse {
            success: Boolean!
            code: ApplicationDeleteResponseCode,
            message: String
        }

        enum ApplicationDeleteResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            const application = await swolly.Application.get(context.token, args.id)
            if (application  === null) { return Errors.ApplicationNotFound() }

            await application.delete()

            return {
                success: true,
            }

        } catch(err) {
            if (err instanceof SwollyErrors.AuthorizationError) {
                return Errors.NotAuthorized()
            }
            console.log(err)
            return Errors.Internal()
        }
    },
    errors: Errors
}





