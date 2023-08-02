import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Video extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  originName: string;

  @Prop({
    enum: ['.mp4', '.avi', '.mkv'],
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  timeStamp: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);

VideoSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});
