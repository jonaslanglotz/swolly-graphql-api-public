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

module.exports = {
    definition: "categoryDelete(id: ID!): CategoryDeleteResponse!",
    schema: `
        type CategoryDeleteResponse {
            success: Boolean!
            code: CategoryDeleteResponseCode,
            message: String
        }

        enum CategoryDeleteResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            const category = await swolly.Category.get(context.token, args.id)
            if (category  === null) { return Errors.CategoryNotFound() }

            await category.delete()

            return {
                success: true,
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




