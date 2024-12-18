import * as rlp from 'rlp';
import { Transaction } from 'ethers';
import { UserService } from '../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { EthereumService } from '../services/ethereum.service';
import { TransactionService } from '../services/transaction.service';
import { Controller, Get, Query, Param, Headers } from '@nestjs/common';

@Controller('lime')
export class TransactionController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly ethereumService: EthereumService,
        private readonly transactionService: TransactionService,
    ) { }

    @Get('all')
    async getAllTransactions() {
        const transactions = await this.transactionService.findAll();
        return { transactions };
    }

    @Get('eth')
    async getTransactions(@Query('transactionHashes') hashes: string[], @Headers('AUTH_TOKEN') token?: string): Promise<{ transactions: Transaction[] }> {
        const userId = this.authService.verifyToken(token);

        const transactions = await this.getTransactionsByHashes(hashes, userId);

        return { transactions };
    }

    @Get('my')
    async getMyTransactions(@Headers('AUTH_TOKEN') token?: string) {
        const userId = this.authService.verifyToken(token);

        const transactions = await this.userService.getRequestedTransactions(userId);

        return { transactions };
    }

    @Get('eth/:rlphex')
    async getTransactionsFromRLP(@Param('rlphex') rlphex: string, @Headers('AUTH_TOKEN') token?: string) {
        const decoded = rlp.decode(Buffer.from(rlphex, 'hex')) as Buffer[];
        const hashes = decoded.map(h => `0x${h.toString('hex')}`);

        return this.getTransactions(hashes, token);
    }

    private async getTransactionsByHashes(hashes: string | string[], userId: string): Promise<Transaction[]> {
        const transactions = [];
        const hashesArray = Array.isArray(hashes) ? hashes : hashes.split(',');

        for (const hash of hashesArray) {
            let transaction = await this.transactionService.findTransactionByHash(hash);

            if (transaction) {
                transactions.push(transaction);
                continue;
            }

            try {
                transaction = await this.ethereumService.getTransaction(hash);
                if (transaction) {
                    await this.transactionService.saveTransaction({ ...transaction, userId });
                    transactions.push(transaction);
                }
            } catch (e) {
                console.log(e);
            }
        }

        return transactions;
    }
}
