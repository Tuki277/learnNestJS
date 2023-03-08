import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CallSchema } from './schema/call.schema';
import { WhereOptions } from 'sequelize';

@Injectable()
export class CallService {
  constructor(
    @InjectModel(CallSchema)
    private callModel: typeof CallSchema,
  ) {}

  async createCall(input): Promise<CallSchema> {
    return this.callModel.create(input);
  }

  async getCall(): Promise<CallSchema[]> {
    return this.callModel.findAll();
  }

  async filter(query: WhereOptions<CallSchema>) {
    return this.callModel.findAll({
      where: query,
    });
  }

  async delete(query: WhereOptions<CallSchema>) {
    if (!query) {
      return this.callModel.destroy();
    } else {
      return this.callModel.destroy({
        where: query,
      });
    }
  }

  async update(query: WhereOptions<CallSchema>, id: string) {
    return this.callModel.update(query, { where: { id } });
  }
}
