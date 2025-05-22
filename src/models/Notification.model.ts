import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './core/User.model';

@Table({ tableName: 'notifications' })
export class Notification extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @Column(DataType.STRING)
  type: 'SYSTEM' | 'COURSE' | 'SECURITY';

  @Column(DataType.STRING(1000))
  message: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isRead: boolean;

  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @BelongsTo(() => User)
  user: User;
}
