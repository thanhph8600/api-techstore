import { Document } from 'mongoose';

export interface Customer extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  avata: string;
  role: number;
  refresh_token: string;
  isBan: boolean;
}

export type payload = {
  username: string;
  phone: string;
  sub: string;
  role: string;
  avata: string;
};
