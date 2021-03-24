const { Errors: SwollyErrors } = require("swolly-js");

const Errors = {
    Internal: () => ({
        success: false,
        code: "INTERNAL",
    }),
    InvalidAuthentication: () => ({
        success: false,
        code: "INVALID_AUTHENTICATION",
    }),
}

module.exports = {
    definition: "userLogin(data: UserLoginInput!): UserLoginResponse!",
    schema: `
        input UserLoginInput {
            mail: String!
            password: String!
        }

        type UserLoginResponse {
            success: Boolean!
            code: UserLoginResponseCode
            message: String
            user: User
            session: Session
        }

        enum UserLoginResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            const { user, session } = await swolly.Session.create(args.data.mail, args.data.password)

            return {
                success: true,
                user: user.getData(),
                session: session.getData(false)
            }

        } catch(err) {
            if (err instanceof SwollyErrors.AuthorizationError) {
                return Errors.InvalidAuthentication()
            }
            console.log(err)
            return Errors.Internal()
        }
    },
    errors: Errors
}

