import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../core/User.model';
import { Enrollment } from './Enrollment.model';

@Table({ tableName: 'courses' })
export class Course extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @Column({
    type: DataType.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
    defaultValue: 'DRAFT',
  })
  status: string;

  @BelongsToMany(() => User, () => Enrollment)
  students: User[];
}
