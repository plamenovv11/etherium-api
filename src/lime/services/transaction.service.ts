import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    async findTransactionByHash(hash: string): Promise<Transaction> {
        return this.transactionRepository.findOneBy({ transactionHash: hash });
    }

    async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
        return this.transactionRepository.find({ where: { userId } });
    }

    async saveTransaction(data: Partial<Transaction>): Promise<Transaction> {
        return this.transactionRepository.save(data);
    }

    async findAll(): Promise<Transaction[]> {
        return this.transactionRepository.find();
    }
}
