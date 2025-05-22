import { Table, Column, Model, DataType, HasMany, BeforeCreate } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { USER_STATUS } from '../../config/constants';
import { Role } from '../rbac/Role.model';
import { Authentication } from './Authentication.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(USER_STATUS),
    defaultValue: USER_STATUS.CREATED,
  })
  status: string;

  @HasMany(() => Role)
  roles: Role[];

  @HasMany(() => Authentication)
  authentications: Authentication[];

  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    const auth = await Authentication.findOne({ where: { userId: this.id } });
    if (!auth) return false;
    return bcrypt.compare(password, auth.password);
  }
}
