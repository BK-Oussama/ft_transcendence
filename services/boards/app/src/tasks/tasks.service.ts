import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaClient } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';

@Injectable()
export class TasksService {
  prisma = new PrismaClient();

  constructor(private tasksGateway: TasksGateway) {}

  findAll(projectId: number) {
    return this.prisma.task.findMany({
      where: { project_id: projectId },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    });
  }

  async create(createTaskDto: CreateTaskDto & { attachment_url?: string }, userId: number) {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description || '',
        status: createTaskDto.status,
        priority: createTaskDto.priority || 'Medium',
        project_id: createTaskDto.projectId,
        created_by: userId,
        position: 0,
        assigned_to: createTaskDto.assignedTo || null,
        start_date: createTaskDto.startDate
          ? new Date(createTaskDto.startDate)
          : null,
        due_date: createTaskDto.dueDate
          ? new Date(createTaskDto.dueDate)
          : null,
        attachment_url: createTaskDto.attachment_url || null,
      },
    });

    this.tasksGateway.broadcastTaskCreated(task);

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto & { attachmentUrl?: string },
  ) {
    try {
      const { assignedTo, startDate, dueDate, attachmentUrl, projectId, ...rest } =
        updateTaskDto;
      const dataToUpdate: any = { ...rest };

      if (attachmentUrl !== undefined) {
        dataToUpdate.attachment_url = attachmentUrl;
      }

      if (assignedTo !== undefined) {
        dataToUpdate.assigned_to = assignedTo;
      }

      if (startDate !== undefined)
        dataToUpdate.start_date = startDate ? new Date(startDate) : null;
      if (dueDate !== undefined)
        dataToUpdate.due_date = dueDate ? new Date(dueDate) : null;
      const task = await this.prisma.task.update({
        where: { id: id },
        data: dataToUpdate,
      });

      this.tasksGateway.broadcastTaskUpdated(task);

      if (updateTaskDto.status) {
        this.tasksGateway.sendNotification(
          `Task "${task.title}" moved to ${task.status}`,
        );
      } else {
        this.tasksGateway.sendNotification(`Task "${task.title}" was updated`);
      }
      return task;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  async reorder(taskIds: number[]) {
    const updates = taskIds.map((id, index) => {
      return this.prisma.task.update({
        where: { id },
        data: { position: index },
      });
    });

    const results = await this.prisma.$transaction(updates);
    this.tasksGateway.broadcastBoardUpdated();
    // results.forEach((task) => this.tasksGateway.broadcastTaskUpdated(task));
    // this.tasksGateway.sendNotification('Board layout was updated');
    return results;
  }

  async remove(id: number) {
    try {
      const task = await this.prisma.task.delete({
        where: { id: id },
      });

      this.tasksGateway.broadcastTaskDeleted(id);

      return task;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  /////////////////////////////////////////////////////////
  // added by the dashboard service
  // for my task page
  findMyTasks(userId: number) {
    return this.prisma.task.findMany({
      where: { assigned_to: userId },
      orderBy: [{ due_date: 'asc' }, { id: 'asc' }],
    });
  }
}
