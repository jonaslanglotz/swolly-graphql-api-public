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
    UserNotFound: msg => ({
        success: false,
        code: "USER_NOT_FOUND",
        message: msg
    }),
}

module.exports = {
    definition: "userDelete(id: ID!): UserDeleteResponse!",
    schema: `
        type UserDeleteResponse {
            success: Boolean!
            code: UserDeleteResponseCode,
            message: String
        }

        enum UserDeleteResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            const user = await swolly.User.get(context.token, args.id)
            if (user  === null) { return Errors.UserNotFound() }

            await user.delete()

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




