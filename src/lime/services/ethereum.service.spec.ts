import { Test, TestingModule } from '@nestjs/testing';
import { EthereumService } from './ethereum.service';
import { ethers } from 'ethers';

jest.mock('ethers');

describe('EthereumService', () => {
    let service: EthereumService;
    let mockProvider: jest.Mocked<ethers.JsonRpcProvider>;

    beforeEach(async () => {
        mockProvider = {
            getBlockNumber: jest.fn(),
            getBlock: jest.fn(),
            getTransaction: jest.fn(),
            getTransactionReceipt: jest.fn(),
        } as unknown as jest.Mocked<ethers.JsonRpcProvider>;

        jest.spyOn(ethers, 'JsonRpcProvider').mockImplementation(() => mockProvider);

        const module: TestingModule = await Test.createTestingModule({
            providers: [EthereumService],
        }).compile();

        service = module.get<EthereumService>(EthereumService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve the current block number', async () => {
        mockProvider.getBlockNumber.mockResolvedValue(123456);

        const blockNumber = await service.getBlockNumber();
        expect(blockNumber).toBe(123456);
        expect(mockProvider.getBlockNumber).toHaveBeenCalled();
    });

    it('should retrieve a block by number', async () => {
        const mockBlock = {
            number: 123456,
            timestamp: 1609459200,
            hash: '0xmockBlockHash',
            parentHash: '0xmockParentHash',
            miner: '0xmockMiner',
            transactions: ['0xmockTx1', '0xmockTx2'],
        } as unknown as ethers.Block;

        mockProvider.getBlock.mockResolvedValue(mockBlock);

        const block = await service.getBlock(123456);
        expect(block).toEqual({
            blockNumber: 123456,
            timestamp: 1609459200,
            hash: '0xmockBlockHash',
            parentHash: '0xmockParentHash',
            miner: '0xmockMiner',
            transactions: ['0xmockTx1', '0xmockTx2'],
        });
        expect(mockProvider.getBlock).toHaveBeenCalledWith(123456);
    });

    it('should return null if the block is not found', async () => {
        mockProvider.getBlock.mockResolvedValue(null);

        const block = await service.getBlock(999999);
        expect(block).toBeNull();
        expect(mockProvider.getBlock).toHaveBeenCalledWith(999999);
    });

    it('should retrieve a transaction by hash', async () => {
        const mockTransaction = {
            hash: '0xmockTxHash',
            blockHash: '0xmockBlockHash',
            blockNumber: 123456,
            from: '0xmockSender',
            to: '0xmockRecipient',
            data: '0xmockData',
            value: '666'
        } as unknown as ethers.TransactionResponse;

        const mockReceipt = {
            status: 1,
            contractAddress: '0xmockContractAddress',
            logs: [{}],
            byzantium: true,
        } as unknown as ethers.TransactionReceipt;

        mockProvider.getTransaction.mockResolvedValue(mockTransaction);
        mockProvider.getTransactionReceipt.mockResolvedValue(mockReceipt);

        const transaction = await service.getTransaction('0xmockTxHash');
        expect(transaction).toEqual({
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
            userId: null,
            user: null,
        });
    });


    it('should return null if the transaction is not found', async () => {
        mockProvider.getTransaction.mockResolvedValue(null);

        const transaction = await service.getTransaction('0xnonexistentTxHash');
        expect(transaction).toBeNull();
        expect(mockProvider.getTransaction).toHaveBeenCalledWith('0xnonexistentTxHash');
    });
});
