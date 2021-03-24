module.exports = {
    definition: "creator: User",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const project = await swolly.Project.get(context.token, parent.id)
            if(project == null) { return null }
            const creator = await project.getCreator()
            return creator == null ? null : creator.getData()
        } catch (err) {
            return null
        }
    },
}


