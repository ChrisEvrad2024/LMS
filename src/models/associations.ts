import { User } from './core/User.model';
import { Authentication } from './core/Authentication.model';
import { Role } from './rbac/Role.model';
import { Permission } from './rbac/Permission.model';

export function setupAssociations() {
  User.hasMany(Authentication, { foreignKey: 'userId' });
  Authentication.belongsTo(User, { foreignKey: 'userId' });

  User.hasMany(Role, { foreignKey: 'userId' });
  Role.belongsTo(User, { foreignKey: 'userId' });

  Role.hasMany(Permission, { foreignKey: 'roleId' });
  Permission.belongsTo(Role, { foreignKey: 'roleId' });
}
