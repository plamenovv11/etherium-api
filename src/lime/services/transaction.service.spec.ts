import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { User } from '../entities/user.entity';
import { DataSource } from 'typeorm';

export const TEST_DB_URL = 'postgres://postgres:admin@localhost:5432/postgres';

describe('TransactionService', () => {
    let service: TransactionService;
    let moduleRef: TestingModule;
    let dataSource: DataSource;

    jest.setTimeout(10000);

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    url: TEST_DB_URL,
                    autoLoadEntities: true,
                    synchronize: true,
                    dropSchema: true,
                }),
                TypeOrmModule.forFeature([Transaction, User]),
            ],
            providers: [TransactionService],
        }).compile();

        service = moduleRef.get<TransactionService>(TransactionService);
        dataSource = moduleRef.get<DataSource>(DataSource);


    });

    it('should save a transaction', async () => {
        const newUser = new User();

        newUser.username = 'testuser';
        newUser.password = 'testpassword';

        const savedUser = await dataSource.getRepository(User).save(newUser);

        const newTransaction = new Transaction();
        newTransaction.transactionHash = '0xabc123';
        newTransaction.transactionStatus = 1;
        newTransaction.blockHash = '0xblock123';
        newTransaction.blockNumber = 12345;
        newTransaction.from = '0xsender123';
        newTransaction.to = '0xrecipient123';
        newTransaction.contractAddress = null;
        newTransaction.logsCount = 1;
        newTransaction.input = '0xinputdata';
        newTransaction.value = '1000000000000000000';
        newTransaction.userId = savedUser.id;

        const savedTransaction = await service.saveTransaction(newTransaction);

        expect(savedTransaction).toBeDefined();
        expect(savedTransaction.transactionHash).toEqual('0xabc123');
    });

    afterAll(async () => {
        await moduleRef.close();
    });
});
