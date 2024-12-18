import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
    @PrimaryColumn()
    transactionHash: string;

    @Column()
    transactionStatus: number;

    @Column()
    blockHash: string;

    @Column()
    blockNumber: number;

    @Column()
    from: string;

    @Column({ nullable: true })
    to: string;

    @Column({ nullable: true })
    contractAddress: string;

    @Column()
    logsCount: number;

    @Column()
    input: string;

    @Column()
    value: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;
}
