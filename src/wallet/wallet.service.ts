import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, InsertResult, Repository } from 'typeorm';
import { WalletSchema } from './schemas/wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletSchema)
    private walletModel: Repository<WalletSchema>,
  ) {}

  async createWallet(input: WalletSchema): Promise<InsertResult> {
    return this.walletModel.insert(input);
  }

  async getAllWallet(): Promise<WalletSchema[]> {
    return this.walletModel
      .query(`select * from user_postgre_sql_schema u, wallet_schema w
    where u."userId" = w."userId";`);
  }

  async filterWallet(query: FindOptionsWhere<WalletSchema>) {
    return this.walletModel.findOne({
      where: query,
    });
  }

  async updateWallet(id: string, update: WalletSchema) {
    return this.walletModel.update(id, update);
  }

  async deleteWallet(id: string) {
    return this.walletModel.delete(id);
  }
}
