module.exports = {
    Query: {
        // APPLICATION
        application: require("./queries/application").resolver,
        applications: require("./queries/applications").resolver,

        // CATEGORY
        category: require("./queries/category").resolver,
        categories: require("./queries/categories").resolver,

        // PROJECT
        project: require("./queries/project").resolver,
        projects: require("./queries/projects").resolver,

        // TASK
        task: require("./queries/task").resolver,
        tasks: require("./queries/tasks").resolver,

        // USER
        user: require("./queries/user").resolver,
        users: require("./queries/users").resolver,

    },
    Mutation: {
        // APPLICATION
        applicationCreate: require("./mutations/applicationCreate").resolver,
        applicationDelete: require("./mutations/applicationDelete").resolver,
        applicationUpdate: require("./mutations/applicationUpdate").resolver,

        // CATEGORY
        categoryCreate: require("./mutations/categoryCreate").resolver,
        categoryDelete: require("./mutations/categoryDelete").resolver,
        categoryUpdate: require("./mutations/categoryUpdate").resolver,

        // IMAGE
        imageUpload: require("./mutations/imageUpload.js").resolver,

        // PROJECT
        projectCreate: require("./mutations/projectCreate").resolver,
        projectDelete: require("./mutations/projectDelete").resolver,
        projectUpdate: require("./mutations/projectUpdate").resolver,

        // TASK
        taskCreate: require("./mutations/taskCreate").resolver,
        taskDelete: require("./mutations/taskDelete").resolver,
        taskUpdate: require("./mutations/taskUpdate").resolver,

        // USER
        userLogin: require("./mutations/userLogin").resolver,
        userLogout: require("./mutations/userLogout").resolver,
        userRegister: require("./mutations/userRegister").resolver,
        userUpdate: require("./mutations/userUpdate").resolver,
        userDelete: require("./mutations/userDelete").resolver,
    },
    User: {
        projects: require("./fields/userProjects").resolver,
    },
    Task: {
        project: require("./fields/taskProject").resolver,
        applications: require("./fields/taskApplications").resolver,
        supporterCount: require("./fields/taskSupporterCount").resolver,
    },
    Application: {
        user: require("./fields/applicationUser").resolver,
        task: require("./fields/applicationTask").resolver,
    },
    Image: {
        file: require("./fields/imageFile").resolver,
    },
    Project: {
        images: require("./fields/projectImages").resolver,
        creator: require("./fields/projectCreator").resolver,
        category: require("./fields/projectCategory").resolver,
        tasks: require("./fields/projectTasks").resolver,
    },
    Category: {
        image: require("./fields/categoryImage").resolver,
    }
}

