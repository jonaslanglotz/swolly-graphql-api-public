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

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "applicationUpdate(values: ApplicationUpdateInput!): ApplicationUpdateResponse!",
    schema: `
        input ApplicationUpdateInput {
            id: ID!
            accepted: Boolean
        }

        type ApplicationUpdateResponse {
            success: Boolean!
            code: ApplicationUpdateResponseCode
            message: String
            application: Application
        }

        enum ApplicationUpdateResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.ApplicationValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const application = await swolly.Application.get(context.token, args.values.id)
            if (application === null) { return Errors.ApplicationNotFound() }

            await application.update(args.values)

            return {
                success: true,
                application: application.getData()
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



