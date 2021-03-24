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
        code: "CATEGORY_NOT_FOUND",
        message: msg
    }),
}

module.exports = {
    definition: "taskDelete(id: ID!): TaskDeleteResponse!",
    schema: `
        type TaskDeleteResponse {
            success: Boolean!
            code: TaskDeleteResponseCode,
            message: String
        }

        enum TaskDeleteResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            const task = await swolly.Task.get(context.token, args.id)
            if (task  === null) { return Errors.TaskNotFound() }

            await task.delete()

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





