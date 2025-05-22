import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'audit_logs' })
export class AuditLog extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  action: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  endpoint: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId: string;

  @Column({
    type: DataType.JSON,
    allowNull: true
  })
  metadata: object;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  ipAddress: string;
}
