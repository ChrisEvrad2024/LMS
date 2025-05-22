import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Course } from './Course.model';
import { User } from '../core/User.model';

@Table({ tableName: 'enrollments' })
export class Enrollment extends Model {
  @ForeignKey(() => Course)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  courseId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'),
    defaultValue: 'PENDING',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt: Date;
}
