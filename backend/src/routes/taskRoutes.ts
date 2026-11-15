import { Router, Request, Response } from 'express';
import { TaskModel, memoryTasksStore, MemoryTask } from '../models/Task.js';
import { isDatabaseConnected } from '../config/db.js';

export const taskRouter = Router();

// GET /api/tasks - Retrieve all tasks
taskRouter.get('/', async (_req: Request, res: Response) => {
  try {
    if (isDatabaseConnected()) {
      const tasks = await TaskModel.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        source: 'mongodb',
        count: tasks.length,
        data: tasks,
      });
    }

    // Fallback in-memory
    return res.json({
      success: true,
      source: 'memory',
      count: memoryTasksStore.length,
      data: memoryTasksStore,
    });
  } catch (err: any) {
    console.error('Error fetching tasks:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks - Create new task
taskRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, priority, status, due_at, planned_for, project_id, color, time_slot } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Task title is required' });
    }

    if (isDatabaseConnected()) {
      const newTask = await TaskModel.create({
        title: title.trim(),
        description: description || null,
        priority: priority || 'medium',
        status: status || 'todo',
        due_at: due_at || null,
        planned_for: planned_for || null,
        project_id: project_id || null,
        color: color || 'purple',
        time_slot: time_slot || '11:00 - 12:00',
        owner_id: 'personal-user',
      });
      return res.status(201).json({ success: true, source: 'mongodb', data: newTask });
    }

    // Fallback in-memory
    const memoryTask: MemoryTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description || null,
      priority: priority || 'medium',
      status: status || 'todo',
      due_at: due_at || null,
      planned_for: planned_for || null,
      completed_at: null,
      color: color || 'purple',
      time_slot: time_slot || '11:00 - 12:00',
      project_id: project_id || null,
      owner_id: 'personal-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryTasksStore.unshift(memoryTask);
    return res.status(201).json({ success: true, source: 'memory', data: memoryTask });
  } catch (err: any) {
    console.error('Error creating task:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/tasks/:id - Update existing task
taskRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isDatabaseConnected()) {
      const updated = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      return res.json({ success: true, source: 'mongodb', data: updated });
    }

    // Fallback in-memory
    const index = memoryTasksStore.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Task not found in memory' });
    }

    memoryTasksStore[index] = {
      ...memoryTasksStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return res.json({ success: true, source: 'memory', data: memoryTasksStore[index] });
  } catch (err: any) {
    console.error('Error updating task:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/tasks/:id - Delete task
taskRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isDatabaseConnected()) {
      const deleted = await TaskModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      return res.json({ success: true, source: 'mongodb', message: 'Task deleted successfully' });
    }

    // Fallback in-memory
    const index = memoryTasksStore.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    memoryTasksStore.splice(index, 1);
    return res.json({ success: true, source: 'memory', message: 'Task deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting task:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});
