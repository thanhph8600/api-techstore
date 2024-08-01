import { Document, ObjectId } from 'mongoose';

export interface Messenger extends Document {
  _id: string;
  id_room_chat: string;
  id_customer: ObjectId;
  id_receiver: ObjectId;
  id_product: ObjectId;
  thumbnail: string;
  messenger: string;
  isWatched: boolean;
  created_at: Date;
}

export interface CreateMessenger {
  id_roomChat: string;
  id_sender: string;
  senderType: string;
  id_product: string | null;
  thumbnail: string | null;
  video: string | null;
  content: string | null;
}
