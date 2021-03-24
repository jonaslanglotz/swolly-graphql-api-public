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
    UploadFailed: msg => ({
        success: false,
        code: "UPLOAD_FAILED",
        message: msg
    }),
}

module.exports = {
    definition: "imageUpload(file: Upload!): ImageUploadResponse!",
    schema: `
        type ImageUploadResponse {
            success: Boolean!
            code: ImageUploadResponseCode
            message: String
            image: Image
        }

        enum ImageUploadResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const file = await args.file
            const stream = file.createReadStream()
            const image = await swolly.Image.create(context.token, stream)

            return {
                success: true,
                image: {
                    ...image.getData(),
                }
            }

        } catch(err) {
            if (err instanceof SwollyErrors.AuthorizationError) {
                return Errors.NotAuthorized()
            }
            if (err instanceof SwollyErrors.UploadError) {
                return Errors.UploadFailed(err.message)
            }
            console.log(err)
            return Errors.Internal()
        }
    },
    errors: Errors
}

