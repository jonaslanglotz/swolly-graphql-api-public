const { Model } = require("swolly-js")

module.exports = {
    definition: "tasks: [Task]",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const tasks = await swolly.Task.getAll(context.token, {
                filter: {
                    projectId: parent.id
                }
            })
            if(tasks == null) { return [] }
            return await Model.getDataFromObject(tasks)
        } catch (err) {
            return []
        }
    },
}

