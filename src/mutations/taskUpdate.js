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
    TaskNotFound: msg => ({
        success: false,
        code: "TASK_NOT_FOUND",
        message: msg
    }),
}

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "taskUpdate(values: TaskUpdateInput!): TaskUpdateResponse!",
    schema: `
        input TaskUpdateInput {
            id: ID!
            title: String
            description: String
            supporterGoal: Int
        }

        type TaskUpdateResponse {
            success: Boolean!
            code: TaskUpdateResponseCode
            message: String
            task: Task
        }

        enum TaskUpdateResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.TaskValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const task = await swolly.Task.get(context.token, args.values.id)
            if (task === null) { return Errors.TaskNotFound() }

            await task.update(args.values)

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
            console.log(err)
            return Errors.Internal()
        }
    },
    errors: Errors
}
