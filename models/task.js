module.exports = function(sequelize, DataTypes) {
    const Task = sequelize.define("Task", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true, 
            primaryKey: true
        }, 
        description: DataTypes.TEXT,
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        priority: {
            type: DataTypes.BOOLEAN, 
            defaultValue: 0
        }
    });

    Task.associate = function(models) {
        // this will make it so that an extra parameter, MilestoneId will be 
        //added as a foreign key 
        Task.belongsTo(models.User);
    };

    return Task;
};
