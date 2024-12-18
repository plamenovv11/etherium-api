import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class EthereumService {
    private provider = new ethers.JsonRpcProvider(process.env.ETH_NODE_URL);

    async getBlockNumber(): Promise<number> {
        const blockNumber = await this.provider.getBlockNumber();
        return blockNumber;
    }

    async getBlock(blockNumber: number) {
        const block = await this.provider.getBlock(blockNumber);
        if (!block) return null;

        return {
            blockNumber: block.number,
            timestamp: block.timestamp,
            hash: block.hash,
            parentHash: block.parentHash,
            miner: block.miner,
            transactions: block.transactions,
        };
    }

    async getTransaction(hash: string): Promise<Transaction> {
        const tx = await this.provider.getTransaction(hash);
        if (!tx) return null;

        const receipt = await this.provider.getTransactionReceipt(hash);

        return {
            transactionHash: tx.hash,
            transactionStatus: receipt.status,
            blockHash: tx.blockHash,
            blockNumber: tx.blockNumber,
            from: tx.from,
            to: tx.to,
            contractAddress: receipt.contractAddress,
            logsCount: receipt.logs.length,
            input: tx.data,
            value: tx.value.toString(),
            userId: null,
            user: null,
        };
    }
}
