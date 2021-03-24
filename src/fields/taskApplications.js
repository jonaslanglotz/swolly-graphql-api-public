const { Model } = require("swolly-js")

module.exports = {
    definition: "applications(filter: ApplicationsFilterInput, sort: ApplicationsSortInput): [Application]",
    schema: ``,
    resolver: async (parent, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            args = args == null ? {} : args
            args.filter = args.filter == null ? {} : args.filter
            args.filter.taskId = parent.id
            const applications = await swolly.Application.getAll(context.token, args)
            if(applications == null) { return [] }
            return await Model.getDataFromObject(applications)
        } catch (err) {
            console.log(err)
            return []
        }
    },
}


