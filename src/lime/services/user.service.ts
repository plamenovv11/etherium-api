import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Injectable()
export class UserService {
    constructor(
        private readonly transactionService: TransactionService
    ) { }

    async getRequestedTransactions(userId: string): Promise<{ transactions: Transaction[] }> {
        const transactions = await this.transactionService.getTransactionsByUserId(userId);
        return { transactions };
    }
}
