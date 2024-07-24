import { Injectable, InternalServerErrorException, Query } from '@nestjs/common';
import { CreateHistorySearchDto } from './dto/create-history-search.dto';
import { UpdateHistorySearchDto } from './dto/update-history-search.dto';
import  { Model , Types} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HistorySearch } from './schemas/history-search.schema';
@Injectable()
export class HistorySearchService {
  constructor(
    @InjectModel(HistorySearch.name) private readonly historySearchModel: Model<HistorySearch>,
  ) {}
  async create(createHistorySearchDto: CreateHistorySearchDto) {
    try {
      const historySearch = await this.historySearchModel.create(createHistorySearchDto);
      return historySearch;
    } catch (error) {
      return error;
    }
  }

  findAll() {
    return `This action returns all historySearch`;
  }

  async findOne(id: string) {
    try {
      const customerId = new Types.ObjectId(id);
      const HistorySearch = await this.historySearchModel.findOne({ customerId: customerId }).exec();
      if (!HistorySearch) {
        const historySearch = await this.historySearchModel.create({
          customerId: customerId,
          query: [],
        })
        return historySearch;
      }
      const historyList = HistorySearch.query.reverse();
      return historyList.slice(0, 6);
    } catch (error) {
      console.error('Error in findOne:', error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateHistorySearchDto: any) {
    try {
      const customerId = new Types.ObjectId(id);
      const { value } = updateHistorySearchDto;
      const historySearch = await this.historySearchModel.findOne({ customerId: customerId }).exec();
      if(historySearch){
        const checkQuery = historySearch.query.find((item: any) => item == value);
        if(checkQuery) {
          return ;
        }else {
          historySearch.query.push(value);
        return await historySearch.save();
        }
      }
    } catch (error) {
      console.error('Error in update:', error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} historySearch`;
  }
}
