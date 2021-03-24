module.exports = {
    definition: "category: Category",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const project = await swolly.Project.get(context.token, parent.id)
            if (project == null) { return null }
            const category = await project.getCategory()
            return category == null ? null : category.getData()
        } catch (err) {
            return null
        }
    },
}


