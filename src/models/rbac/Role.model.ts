import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../core/User.model';
import { Permission } from './Permission.model';
import { ROLES } from '../../config/constants';

@Table({ tableName: 'roles' })
export class Role extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ROLES),
    allowNull: false,
  })
  type: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Permission)
  permissions: Permission[];
}
