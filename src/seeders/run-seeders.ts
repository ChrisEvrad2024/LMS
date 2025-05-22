import { User } from '../models/core/User.model';
import { Role } from '../models/rbac/Role.model';
import { Permission } from '../models/rbac/Permission.model';
import { Authentication } from '../models/core/Authentication.model';
import { ROLES } from '../config/constants';
import sequelize from '../config/database';

(async () => {
  try {
    await sequelize.sync({ force: true });

    // Create superadmin
    const superadmin = await User.create({
      email: 'superadmin@lms.com',
    });

    await Authentication.create({
      username: 'superadmin@lms.com',
      password: 'superadmin123',
      userId: superadmin.id,
    });

    const superadminRole = await Role.create({
      type: ROLES.SUPERADMIN,
      userId: superadmin.id,
    });

    await Permission.bulkCreate([
      {
        resource: '*',
        create: true,
        read: true,
        update: true,
        delete: true,
        roleId: superadminRole.id,
      },
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
})();
