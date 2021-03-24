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
    ImageNotFound: message => ({
        success: false,
        code: "IMAGE_NOT_FOUND",
        message
    }),
}

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "projectCreate(values: ProjectCreateInput!): ProjectCreateResponse!",
    schema: `
        input ProjectCreateInput {
            title: String!
            description: String!
            moneyGoal: Float = 0
            lat: Float = 0
            lon: Float = 0
            CreatorId: ID
            CategoryId: ID!
            ImageIds: [ID!]!
        }

        type ProjectCreateResponse {
            success: Boolean!
            code: ProjectCreateResponseCode
            message: String
            project: Project
        }

        enum ProjectCreateResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.ProjectValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            if (args.values.ImageIds.length > 10 ) {
                return ValidationError(
                    Enums.ProjectValidationErrorCode.TOO_MANY_IMAGES,
                    "A project may not have more than 10 images."
                )
            }

            var images = []
            for (const id of args.values.ImageIds) {
                const image = await swolly.Image.get(context.token, id)
                if (image == null) { 
                    return Errors.ImageNotFound(`Image with id '${id} could not be found.`)
                }
                images.push(image)
            }

            const project = await swolly.Project.create(context.token, args.values)

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

