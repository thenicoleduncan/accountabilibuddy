module.exports = function(sequelize, DataTypes) {
    const Goal = sequelize.define("Goal", {
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
    });

    Goal.associate = function(models) {
        Goal.belongsTo(models.User);
        Goal.hasMany(models.Task);
    };

    return Goal;
};
