import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;
  
  @Column("varchar", {
    length: 255,
    nullable: false,
  })
  password: string;
  
  @Column("varchar", {
    length: 255,
    nullable: false,
    select: false,
  })
  fullName: string;
  
  @Column("boolean", {
    default: true,
  })
  isActive: boolean;

  @Column("varchar", {
    length: 255,
    nullable: false,
  })
  roles: string;
} 