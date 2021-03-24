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
    definition: "applications(filter: ApplicationsFilterInput, sort: ApplicationsSortInput): ApplicationsResponse!",
    schema: `
        type ApplicationsResponse {
            success: Boolean!
            code: ApplicationsResponseCode
            message: String
            applications: [Application]
        }

        input ApplicationsFilterInput {
            accepted: Boolean
            taskId: ID
            userId: ID
            projectId: ID
        }

        input ApplicationsSortInput {
            field: ApplicationsSortField!
            direction: SortDirection!
        }

        enum ApplicationsSortField {
            ${Object.keys(Enums.ApplicationSortField).map(key => key + "\n")}
        }

        enum ApplicationsResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const applications = await swolly.Application.getAll(context.token, args)
            return {
                success: true,
                applications: await Model.getDataFromObject(applications)
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

