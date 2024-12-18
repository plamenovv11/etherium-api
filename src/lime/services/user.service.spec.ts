import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from '../entities/transaction.entity';

export function createMockTransaction(): Transaction {
    return {
        transactionHash: '0xabc123',
        transactionStatus: 1,
        blockHash: '0xblock123',
        blockNumber: 12345,
        from: '0xsender123',
        to: '0xrecipient123',
        contractAddress: null,
        logsCount: 2,
        input: '0xinputdata',
        value: '1000000000000000000',
        user: { id: 'user1', username: 'testuser' } as any,
        userId: 'user1',
    };
}

describe('UserService', () => {
    let service: UserService;
    let mockTransactionService: jest.Mocked<TransactionService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: TransactionService,
                    useValue: {
                        getTransactionsByUserId: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        mockTransactionService = module.get(TransactionService);
    });

    it('should retrieve transactions for a user', async () => {
        const mockTransactions = [createMockTransaction()];
        mockTransactionService.getTransactionsByUserId.mockResolvedValue(mockTransactions);

        const result = await service.getRequestedTransactions('user1');
        expect(result.transactions).toEqual(mockTransactions);
        expect(mockTransactionService.getTransactionsByUserId).toHaveBeenCalledWith('user1');
    });
});
