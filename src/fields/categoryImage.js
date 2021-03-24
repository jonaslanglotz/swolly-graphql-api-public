module.exports = {
    definition: "image: Image",
    schema: ``,
    resolver: async (parent, __, { dataSources }) =>  {
        const { swolly, context } = dataSources.swolly
        
        try {
            const category = await swolly.Category.get(context.token, parent.id)
            if (category == null) { return null }

            const image = await category.getImage()
            return image == null ? null : image.getData()
        } catch (err) {
            return null
        }
    },
}


