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
}

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "userRegister(values: UserRegisterInput!): UserRegisterResponse!",
    schema: `
        input UserRegisterInput {
            fullname: String!
            mail: String!
            gender: Gender!
            role: Role
            password: String!
        }

        type UserRegisterResponse {
            success: Boolean!
            code: UserRegisterResponseCode
            message: String
            user: User
            session: Session
        }

        enum UserRegisterResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.UserValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const { user, session } = await swolly.User.create(context.token, args.values)

            return {
                success: true,
                user: user.getData(),
                session: session.getData(false)
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
