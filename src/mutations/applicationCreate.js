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
    TaskNotFound: () => ({
        success: false,
        code: "TASK_NOT_FOUND",
    }),
}

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "applicationCreate(values: ApplicationCreateInput!): ApplicationCreateResponse!",
    schema: `
        input ApplicationCreateInput {
            text: String!
            taskId: ID!
        }

        type ApplicationCreateResponse {
            success: Boolean!
            code: ApplicationCreateResponseCode
            message: String
            application: Application
        }

        enum ApplicationCreateResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.ApplicationValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const application = await swolly.Application.create(context.token, args.values)
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
            if (err instanceof SwollyErrors.NotFoundError) {
                return Errors.TaskNotFound()
            }
            console.log(err)
            return Errors.Internal()
        }
    },
    errors: Errors
}


