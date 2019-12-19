module.exports = function(sequelize, DataTypes) {
    const Calendar = sequelize.define("Calendar", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }, 
        description: DataTypes.TEXT,
        start_date: DataTypes.DATE,
        due_date: DataTypes.DATE
    });

    Calendar.associate = function(models) {
        Calendar.belongsTo(models.User);
        
        Calendar.hasMany(models.CalendarEvent);
    };

    return Calendar;
};
