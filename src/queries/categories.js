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
    definition: "categories(sort: CategoriesSortInput): CategoriesResponse!",
    schema: `
        type CategoriesResponse {
            success: Boolean!
            code: CategoriesResponseCode
            message: String
            categories: [Category]
        }

        input CategoriesSortInput {
            field: CategoriesSortField!
            direction: SortDirection!
        }
        
        enum CategoriesSortField {
            ${Object.keys(Enums.CategorySortField).map(key => key + "\n")}
        }

        enum CategoriesResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            let categories = await swolly.Category.getAll(context.token, args)

            return {
                success: true,
                categories: await Model.getDataFromObject(categories)
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

