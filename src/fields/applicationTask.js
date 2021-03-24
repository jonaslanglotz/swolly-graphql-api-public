module.exports = {
    definition: "task: Task",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const application = await swolly.Application.get(context.token, parent.id)
            if (application == null) { return null }

            const task = await application.getTask()
            return task == null ? null : task.getData()
        } catch (err) {
            return null
        }
    },
}

