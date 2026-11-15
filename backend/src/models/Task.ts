import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string | null;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_at?: string | null;
  planned_for?: string | null;
  completed_at?: string | null;
  color?: string;
  time_slot?: string;
  project_id?: string | null;
  owner_id: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed', 'cancelled'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    due_at: { type: String, default: null },
    planned_for: { type: String, default: null },
    completed_at: { type: String, default: null },
    color: { type: String, default: 'purple' },
    time_slot: { type: String, default: '11:00 - 12:00' },
    project_id: { type: String, default: null },
    owner_id: { type: String, default: 'personal-user' },
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

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

// In-Memory Fallback Store (Used if MONGODB_URI is not connected yet)
export interface MemoryTask {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_at: string | null;
  planned_for: string | null;
  completed_at: string | null;
  color: string;
  time_slot: string;
  project_id: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export const memoryTasksStore: MemoryTask[] = [
  {
    id: 'task-1',
    title: 'Spanish for Beginners - Flashcard Practice',
    description: 'Master top 30 conversational vocabulary cards',
    status: 'in_progress',
    priority: 'high',
    due_at: new Date(Date.now() + 86400000).toISOString(),
    planned_for: new Date().toISOString(),
    completed_at: null,
    color: 'purple',
    time_slot: '09:00 - 10:30',
    project_id: 'p-1',
    owner_id: 'personal-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'French Essentials - Audio Pronunciation',
    description: 'Listen and practice speaking accents',
    status: 'todo',
    priority: 'medium',
    due_at: new Date(Date.now() + 172800000).toISOString(),
    planned_for: null,
    completed_at: null,
    color: 'pink',
    time_slot: '11:30 - 12:30',
    project_id: 'p-2',
    owner_id: 'personal-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Daily Review & Grammar Milestone',
    description: 'Complete 20 new phrases quiz',
    status: 'completed',
    priority: 'urgent',
    due_at: new Date().toISOString(),
    planned_for: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    color: 'yellow',
    time_slot: '14:00 - 15:00',
    project_id: 'p-1',
    owner_id: 'personal-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
