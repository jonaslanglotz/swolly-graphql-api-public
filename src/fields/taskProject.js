module.exports = {
    definition: "project: Project",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const task = await swolly.Task.get(context.token, parent.id)
            if (task == null) { return null }

            const project = await task.getProject()
            return project == null ? null : project.getData()
        } catch (err) {
            console.log(err)
            return null
        }
    },
}
