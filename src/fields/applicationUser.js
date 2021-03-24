module.exports = {
    definition: "user: User",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const application = await swolly.Application.get(context.token, parent.id)
            if (application == null) { return null }

            const user = await application.getUser()
            return user == null ? null : user.getData()
        } catch (err) {
            return null
        }
    },
}
