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
    definition: "project(id: ID!): ProjectResponse",
    schema: `
        type ProjectResponse {
            success: Boolean!
            code: ProjectResponseCode
            message: String
            project: Project
        }

        enum ProjectResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        const { id } = args

        try {
            const project = await swolly.Project.get(context.token, id)
            if(project == null || project.getData() === null) { 
                return Errors.ProjectNotFound()
            }

            return {
                success: true,
                project: project.getData()
            }
        } catch(err) {
            console.log(err)
            return Errors.Internal()
        }

    },
    errors: Errors
}


