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
    ProjectNotFound: () => ({
        success: false,
        code: "PROJECT_NOT_FOUND",
    }),
}

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "taskCreate(values: TaskCreateInput!): TaskCreateResponse!",
    schema: `
        input TaskCreateInput {
            title: String!
            description: String!
            supporterGoal: Int!
            projectId: ID!
        }

        type TaskCreateResponse {
            success: Boolean!
            code: TaskCreateResponseCode
            message: String
            task: Task
        }

        enum TaskCreateResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.TaskValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const task = await swolly.Task.create(context.token, args.values)
            return {
                success: true,
                task: task.getData()
            }
        } catch(err) {
            if (err instanceof SwollyErrors.AuthorizationError) {
                return Errors.NotAuthorized()
            }
            if (err instanceof SwollyErrors.ValidationError) {
                return ValidationError(err.code, err.message)
            }
            if (err instanceof SwollyErrors.NotFoundError) {
                return Errors.ProjectNotFound()
            }
            console.log(err)
            return Errors.Internal()
        }
    },
    errors: Errors
}


