import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaClient } from '@prisma/client';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';

@Injectable()
export class TasksService {
  prisma = new PrismaClient();

  constructor(
    private tasksGateway: TasksGateway,
    private httpService: HttpService
  ) {}

  findAll(projectId: number) {
    return this.prisma.task.findMany({
      where: { project_id: projectId },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    });
  }

  async create(createTaskDto: CreateTaskDto & { attachment_url?: string }, userId: number, headers: any) {
    let userRole: string;
    try {
      const response: any = await firstValueFrom(
        this.httpService.get(
          `https://dashboard:443/projects/${createTaskDto.projectId}/members/${userId}/role`, 
          {
            headers: {
              ...(headers.authorization ? { Authorization: headers.authorization } : {}),
              ...(headers.cookie ? { Cookie: headers.cookie } : {})
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
          }
        )
      );
      userRole = response.data.role;
    } catch (error) {
       const status = error.response?.status || 'Network Error';
       console.error(`🚨 Dashboard Request Failed [${status}]:`, error.message);
       
       throw new ForbiddenException('You do not have access to this project or the project service is unreachable.');
    }

    if (userRole === 'VIEWER')
      throw new ForbiddenException('Viewers do not have permission to create tasks.');
    if (userRole === 'MEMBER')
      throw new ForbiddenException('Member do not have permission to create tasks.');

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
        start_date: createTaskDto.startDate ? new Date(createTaskDto.startDate) : null,
        due_date: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        attachment_url: createTaskDto.attachment_url || null,
      },
    });

    this.tasksGateway.broadcastTaskCreated(task);
    this.tasksGateway.sendNotification(
      `New task created "${task.title}"`
    );

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto & { attachmentUrl?: string },
  ) {
    try {
      const existingTask = await this.prisma.task.findUnique({
        where: { id: id },
      });

      if (!existingTask)
        throw new NotFoundException(`Task with ID ${id} not found`);

      const { assignedTo, startDate, dueDate, attachmentUrl, projectId, ...rest } =
        updateTaskDto;
      const dataToUpdate: any = { ...rest };

      if (attachmentUrl !== undefined)
        dataToUpdate.attachment_url = attachmentUrl;

      if (assignedTo !== undefined)
        dataToUpdate.assigned_to = assignedTo;

      if (startDate !== undefined)
        dataToUpdate.start_date = startDate ? new Date(startDate) : null;
      if (dueDate !== undefined)
        dataToUpdate.due_date = dueDate ? new Date(dueDate) : null;

      const task = await this.prisma.task.update({
        where: { id: id },
        data: dataToUpdate,
      });

      this.tasksGateway.broadcastTaskUpdated(task);


      if (updateTaskDto.status && updateTaskDto.status !== existingTask.status) {
        this.tasksGateway.sendNotification(
          `Task "${task.title}" moved to ${task.status}`, 
          task.priority
        );
      } else {
        this.tasksGateway.sendNotification(
          `Task "${task.title}" was updated`, 
          task.priority
        );
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
      this.tasksGateway.sendNotification(
        `Task "${task.title}" was deleted`, 
        task.priority
      );
      return task;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

async deleteAllTasksByProject(projectId: number) {
    const deletedTasks = await this.prisma.task.deleteMany({
      where: { 
        project_id: projectId
      }
    });
    return { success: true, deletedCount: deletedTasks.count };
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
