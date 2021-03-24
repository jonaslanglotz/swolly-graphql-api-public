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
    ProjectNotFound: msg => ({
        success: false,
        code: "PROJECT_NOT_FOUND",
        message: msg
    }),
}

module.exports = {
    definition: "projectDelete(id: ID!): ProjectDeleteResponse!",
    schema: `
        type ProjectDeleteResponse {
            success: Boolean!
            code: ProjectDeleteResponseCode,
            message: String
        }

        enum ProjectDeleteResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            const project = await swolly.Project.get(context.token, args.id)
            if (project === null) { return Errors.ProjectNotFound() }

            await project.delete()

            return {
                success: true
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



