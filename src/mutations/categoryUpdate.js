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
    CategoryNotFound: msg => ({
        success: false,
        code: "CATEGORY_NOT_FOUND",
        message: msg
    }),
}

const ValidationError = (code, message) => ({
    success: false,
    code,
    message
})

module.exports = {
    definition: "categoryUpdate(values: CategoryUpdateInput!): CategoryUpdateResponse!",
    schema: `
        input CategoryUpdateInput {
            id: ID!
            name: String
            ImageId: ID
        }

        type CategoryUpdateResponse {
            success: Boolean!
            code: CategoryUpdateResponseCode
            message: String
            category: Category
        }

        enum CategoryUpdateResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
            ${Object.keys(Enums.CategoryValidationErrorCode).map(key => key + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) => {
        const { swolly, context } = dataSources.swolly

        try {
            const category = await swolly.Category.get(context.token, args.values.id)
            if (category === null) { return Errors.CategoryNotFound() }

            await category.update(args.values)

            return {
                success: true,
                category: category.getData()
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


