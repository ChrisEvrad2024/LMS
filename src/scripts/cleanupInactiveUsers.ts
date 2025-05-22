import { User } from '../models';
import { Op } from 'sequelize';

const INACTIVE_DAYS = 90;

async function cleanup() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - INACTIVE_DAYS);

  await User.update(
    { status: 'DEACTIVATED' },
    {
      where: {
        lastLogin: { [Op.lt]: cutoffDate },
        status: { [Op.ne]: 'DEACTIVATED' }
      }
    }
  );
}

cleanup().then(() => process.exit(0));
