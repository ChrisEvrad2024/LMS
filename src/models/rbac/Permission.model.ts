import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Role } from './Role.model';

@Table({ tableName: 'permissions' })
export class Permission extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  roleId: string;
}
