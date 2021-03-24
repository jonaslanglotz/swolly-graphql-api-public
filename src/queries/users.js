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
    definition: "users(filter: UsersFilterInput, sort: UsersSortInput): UsersResponse!",
    schema: `
        type UsersResponse {
            success: Boolean!
            code: UsersResponseCode
            message: String
            users: [User]
        }

        input UsersFilterInput {
            role: Role
            supportingTaskId: ID
        }

        input UsersSortInput {
            field: UsersSortField!
            direction: SortDirection!
        }
        
        enum UsersSortField {
            ${Object.keys(Enums.UserSortField).map(key => key + "\n")}
        }

        enum UsersResponseCode {
            ${Object.keys(Errors).map(key => Errors[key]().code + "\n")}
        }
    `,
    resolver: async (_, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        try {
            const users = swolly.User.getAll(context.token, args)
            return {
                success: true,
                users: await Model.getDataFromObject(users)
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
