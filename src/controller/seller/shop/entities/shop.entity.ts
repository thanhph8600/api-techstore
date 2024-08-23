import { ObjectId } from 'mongoose';
export class Shop {
  _id: ObjectId;
  id_customer: {
    _id: string;
    name: string;
    phone: string;
    avata: string;
  }[];
}
