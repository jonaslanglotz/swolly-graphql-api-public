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
    CategoryNotFound: msg => ({
        success: false,
        code: "CATEGORY_NOT_FOUND",
        message: msg
    }),
}

module.exports = {
    definition: "category(id: ID!): CategoryResponse",
    schema: `
        type CategoryResponse {
            success: Boolean!
            code: CategoryResponseCode
            message: String
            category: Category
        }

        enum CategoryResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        const { id } = args

        try {
            const category = await swolly.Category.get(context.token, id)
            if(category == null || category.getData()) { 
                return Errors.CategoryNotFound()
            }

            return {
                success: true,
                category: category.getData()
            }
        } catch(err) {
            console.log(err)
            return Errors.Internal()
        }

    },
    errors: Errors
}

