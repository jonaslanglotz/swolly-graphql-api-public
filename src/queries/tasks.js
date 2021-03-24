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

module.exports = {
    definition: "tasks(filter: TasksFilterInput, sort: TasksSortInput): TasksResponse!",
    schema: `
        type TasksResponse {
            success: Boolean!
            code: TasksResponseCode
            message: String
            tasks: [Task]
        }

        input TasksFilterInput {
            projectId: ID
            supporterId: ID
        }

        input TasksSortInput {
            field: TasksSortField!
            direction: SortDirection!
        }

        enum TasksSortField {
            ${Object.keys(Enums.TaskSortField).map(key => key + "\n")}
        }

        enum TasksResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const tasks = await swolly.Task.getAll(context.token, args)
            return {
                success: true,
                tasks: await Model.getDataFromObject(tasks)
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

