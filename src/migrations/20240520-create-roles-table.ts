import { QueryInterface, DataTypes } from 'sequelize';
import { ROLES } from '../constants/roles';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('roles', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ROLES)),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Seed initial roles
    await queryInterface.bulkInsert('roles', 
      Object.values(ROLES).map(role => ({ type: role }))
    );
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('roles');
  }
};
