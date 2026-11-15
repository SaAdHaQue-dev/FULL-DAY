import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  flag?: string;
  color: string;
  progress: number;
}

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    flag: { type: String, default: '🌐' },
    color: { type: String, default: '#6C5CE7' },
    progress: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

export const memoryProjectsStore = [
  {
    id: 'p-1',
    name: 'Spanish for Beginners',
    flag: '🇪🇸',
    color: '#FF5E8E',
    progress: 65,
  },
  {
    id: 'p-2',
    name: 'French Essentials',
    flag: '🇫🇷',
    color: '#339AF0',
    progress: 40,
  },
  {
    id: 'p-3',
    name: 'Japanese Basics',
    flag: '🇯🇵',
    color: '#FFAE33',
    progress: 20,
  },
];
