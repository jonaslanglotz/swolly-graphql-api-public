const { Errors: SwollyErrors, Enums } = require("swolly-js");

const Errors = {
    Internal: () => ({
        success: false,
        code: "INTERNAL",
    }),
    UserNotFound: () => ({
        success: false,
        code: "USER_NOT_FOUND",
    }),
}

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "userUpdate(values: UserUpdateInput!): UserUpdateResponse!",
    schema: `
        input UserUpdateInput {
            id: ID!
            fullname: String
            mail: String
            gender: Gender
            role: Role
            password: String
        }

        type UserUpdateResponse {
            success: Boolean!
            code: UserUpdateResponseCode
            message: String
            user: User
        }

        enum UserUpdateResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.UserValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const user = await swolly.User.get(context.token, args.values.id)

            if (user == null) {
                return Errors.UserNotFound()
            }
            
            await user.update(args.values)

            // Response
            return {
                success: true,
                user: user.getData(),
            }

        } catch(err) {
            if (err instanceof SwollyErrors.AuthorizationError) {
                return Errors.NotAuthorized()
            }
            if (err instanceof SwollyErrors.ValidationError) {
                return ValidationError(err.code, err.message)
            }
            console.log(err)
            return Errors.Internal()
        }
    },
    errors: Errors
}

