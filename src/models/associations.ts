import { User } from './core/User.model';
import { Authentication } from './core/Authentication.model';
import { Role } from './rbac/Role.model';
import { Permission } from './rbac/Permission.model';

export function setupAssociations() {
  // User associations
  User.hasMany(Authentication, { foreignKey: 'userId', as: 'authentications' });
  Authentication.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasMany(Role, { foreignKey: 'userId', as: 'roles' });
  Role.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Role associations
  Role.hasMany(Permission, { foreignKey: 'roleId', as: 'permissions' });
  Permission.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
}
