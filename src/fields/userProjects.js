const { Model } = require("swolly-js");

module.exports = {
    definition: "projects(showHidden: Boolean = false, filter: ProjectsFilterInput, location: ProjectsLocationInput, sort: ProjectsSortInput): [Project]",
    schema: ``,
    resolver: async (parent, args, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly

        args = args == null ? {} : args
        args.filter = args.filter == null ? {} : args.filter
        args.filter.creatorId = parent.id
        
        try {
            const projects = await swolly.Project.getAll(context.token, args)
            if(projects == null) { return [] }
            return await Model.getDataFromObject(projects)
        } catch (err) {
            return []
        }
    },
}
