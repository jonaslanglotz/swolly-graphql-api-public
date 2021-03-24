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
    TaskNotFound: msg => ({
        success: false,
        code: "TASK_NOT_FOUND",
        message: msg
    }),
}

module.exports = {
    definition: "task(id: ID!): TaskResponse",
    schema: `
        type TaskResponse {
            success: Boolean!
            code: TaskResponseCode
            message: String
            task: Task
        }

        enum TaskResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        const { id } = args

        try {

            const task = await swolly.Task.get(context.token, id)
            if(task === null || task.getData() === null) { 
                return Errors.TaskNotFound()
            }

            return { success: true, task: task.getData() }

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


