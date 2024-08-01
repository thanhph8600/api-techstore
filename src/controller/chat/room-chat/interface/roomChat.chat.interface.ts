import { Document, ObjectId } from 'mongoose';

export interface RoomChat extends Document {
  _id: string;
  id_room_chat: Array<ObjectId>;
  theLastMess: ObjectId;
}
