import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import * as rlp from 'rlp';
import { UserService } from '../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { EthereumService } from '../services/ethereum.service';
import { TransactionService } from '../services/transaction.service';
import { createMockTransaction } from '../services/user.service.spec';

describe('TransactionController', () => {
    let controller: TransactionController;
    let mockUserService: UserService;
    let mockAuthService: AuthService;
    let mockEthereumService: EthereumService;
    let mockTransactionService: TransactionService;

    beforeEach(async () => {
        mockUserService = {
            getRequestedTransactions: jest.fn(),
        } as unknown as UserService;

        mockAuthService = {
            verifyToken: jest.fn(),
        } as unknown as AuthService;

        mockEthereumService = {
            getTransaction: jest.fn(),
        } as unknown as EthereumService;

        mockTransactionService = {
            findAll: jest.fn(),
            findTransactionByHash: jest.fn(),
            saveTransaction: jest.fn(),
        } as unknown as TransactionService;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: EthereumService, useValue: mockEthereumService },
                { provide: TransactionService, useValue: mockTransactionService },
            ],
        }).compile();

        controller = module.get<TransactionController>(TransactionController);
    });

    it('should decode RLP hex correctly', async () => {
        const rlpHex = Buffer.from(rlp.encode(['0xabc123', '0xdef456'])).toString('hex');
        const getTransactionsSpy = jest.spyOn(controller, 'getTransactions').mockResolvedValue({ transactions: [] });
        await controller.getTransactionsFromRLP(rlpHex);

        expect(getTransactionsSpy).toHaveBeenCalledWith(['0xabc123', '0xdef456'], undefined);
    });

    it('should retrieve all transactions', async () => {
        const mockTransactions = [{
            transactionHash: '0xmockTxHash',
            transactionStatus: 1,
            blockHash: '0xmockBlockHash',
            blockNumber: 123456,
            from: '0xmockSender',
            to: '0xmockRecipient',
            contractAddress: '0xmockContractAddress',
            logsCount: 1,
            input: '0xmockData',
            value: '666',
            userId: 'user1',
            user: null,
        }];
        jest.spyOn(mockTransactionService, 'findAll').mockResolvedValue(mockTransactions);

        const result = await controller.getAllTransactions();

        expect(result.transactions).toEqual(mockTransactions);
        expect(mockTransactionService.findAll).toHaveBeenCalled();
    });

    it('should retrieve transactions by hashes', async () => {
        jest.spyOn(mockAuthService, 'verifyToken').mockReturnValue('user1');
        jest.spyOn(mockTransactionService, 'findTransactionByHash').mockResolvedValue(null);

        const mockedTransaction = createMockTransaction();

        jest.spyOn(mockEthereumService, 'getTransaction').mockResolvedValue(mockedTransaction);
        jest.spyOn(mockTransactionService, 'saveTransaction').mockResolvedValue(undefined);

        const result = await controller.getTransactions(['0xmockTxHash'], 'mock-token');

        expect(result.transactions).toEqual([mockedTransaction]);
        expect(mockAuthService.verifyToken).toHaveBeenCalledWith('mock-token');
        expect(mockTransactionService.findTransactionByHash).toHaveBeenCalledWith('0xmockTxHash');
        expect(mockEthereumService.getTransaction).toHaveBeenCalledWith('0xmockTxHash');
        expect(mockTransactionService.saveTransaction).toHaveBeenCalled();
    });

    it('should retrieve user-specific transactions', async () => {
        const mockTransactions = [{
            transactionHash: '0xmockTxHash',
            transactionStatus: 1,
            blockHash: '0xmockBlockHash',
            blockNumber: 123456,
            from: '0xmockSender',
            to: '0xmockRecipient',
            contractAddress: '0xmockContractAddress',
            logsCount: 1,
            input: '0xmockData',
            value: '666',
            userId: 'user1',
            user: null,
        }];
        jest.spyOn(mockAuthService, 'verifyToken').mockReturnValue('user1');
        jest.spyOn(mockUserService, 'getRequestedTransactions').mockResolvedValue({ transactions: mockTransactions });

        const result = await controller.getMyTransactions('mock-token');

        expect(result.transactions.transactions).toEqual(mockTransactions);
        expect(mockAuthService.verifyToken).toHaveBeenCalledWith('mock-token');
        expect(mockUserService.getRequestedTransactions).toHaveBeenCalledWith('user1');
    });
});
