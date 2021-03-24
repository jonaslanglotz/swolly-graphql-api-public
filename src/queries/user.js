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
    definition: "user(id: ID): UserResponse",
    schema: `
        type UserResponse {
            success: Boolean!
            code: UserResponseCode
            message: String
            user: User
        }

        enum UserResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        const { id } = args

        try {

            if (id == null) {
                const user = await swolly.User._getAuth(context.token)
                return { success: true, user: user.getData() }
            }

            const user = await swolly.User.get(context.token, id)
            if(user === null || user.getData() === null) { 
                return Errors.UserNotFound()
            }

            return { success: true, user: user.getData() }

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

