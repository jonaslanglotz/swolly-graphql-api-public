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
    definition: "projects(showHidden: Boolean = false, filter: ProjectsFilterInput, location: ProjectsLocationInput, sort: ProjectsSortInput): ProjectsResponse!",
    schema: `
        type ProjectsResponse {
            success: Boolean!
            code: ProjectsResponseCode
            message: String
            projects: [Project]
        }

        input ProjectsFilterInput {
            categoryId: ID
            creatorId: ID
            imageId: ID
            status: ProjectStatus
        }

        input ProjectsLocationInput {
            lat: Float!
            lon: Float!
            maxDistance: Float = 15000
        }

        input ProjectsSortInput {
            field: ProjectsSortField!
            direction: SortDirection!
        }

        enum ProjectsSortField {
            ${Object.keys(Enums.ProjectSortField).map(key => key + "\n")}
        }

        enum ProjectsResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const projects = await swolly.Project.getAll(context.token, args)
            return {
                success: true,
                projects: await Model.getDataFromObject(projects)
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
