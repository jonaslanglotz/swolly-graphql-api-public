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
    ImageNotFound: msg => ({
        success: false,
        code: "IMAGE_NOT_FOUND",
        message: msg
    }),
    ProjectNotFound: msg => ({
        success: false,
        code: "PROJECT_NOT_FOUND",
        message: msg
    }),
}

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "projectUpdate(values: ProjectUpdateInput!): ProjectUpdateResponse!",
    schema: `
        input ProjectUpdateInput {
            id: ID!
            title: String
            description: String
            status: ProjectStatus
            moneyGoal: Float
            lat: Float
            lon: Float
            CategoryId: ID
            CreatorId: ID
            ImageIds: [ID!]
        }

        type ProjectUpdateResponse {
            success: Boolean!
            code: ProjectUpdateResponseCode
            message: String
            project: Project
        }

        enum ProjectUpdateResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.ProjectValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const project = await swolly.Project.get(context.token, args.values.id)
            if (project === null) { return Errors.ProjectNotFound() }

            var images = []
            if (args.values.imageIds != null) {
                if (args.values.ImageIds.length > 10 ) {
                    return ValidationError(
                        Enums.ProjectValidationErrorCode.TOO_MANY_IMAGES,
                        "A project may not have more than 10 images."
                    )
                }

                for (const id of args.values.ImageIds) {
                    const image = await swolly.Image.get(context.token, id)
                    if (image == null) { 
                        return Errors.ImageNotFound(`Image with id '${id} could not be found.`)
                    }
                    images.push(image)
                }
            }
            
            await project.update(args.values)

            for (const image of (await project.getImages())) {
                await image.unassign(project.getId())
            }

            for (const image of images) {
                await image.assign(project.getId())
            }

            return {
                success: true,
                project: project.getData()
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

