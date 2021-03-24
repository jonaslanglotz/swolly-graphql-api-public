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
}

module.exports = {
    definition: "userLogout: UserLogoutResponse!",
    schema: `
        type UserLogoutResponse {
            success: Boolean!
            code: UserLogoutResponseCode,
            message: String
        }

        enum UserLogoutResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            await store.Session.deleteByToken(token)

            return {
                success: true
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


