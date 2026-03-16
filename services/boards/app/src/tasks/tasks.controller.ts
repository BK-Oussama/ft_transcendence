import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksGateway } from './tasks.gateway';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TaskStatus } from './dto/task-status.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  /////////////////////////////////////////////
  // added by the dashboard service
  @Get('my-tasks')
  async findMyTasks(@Req() req: any) {
    return this.tasksService.findMyTasks(req.user.id);
  }

  @Get()
  async findAll(@Query('projectId', ParseIntPipe) projectId: number) {
    return await this.tasksService.findAll(projectId);
  }

  // added by dashboard
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    return this.tasksService.update(id, { status: body.status as TaskStatus });
  }
  ///////////////////////////////////////////////


  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    if (file) {
      (createTaskDto as any).attachment_url = file.filename;
    }
    const realUserId = req.user.id;
    const task = await this.tasksService.create(createTaskDto, realUserId);
    this.tasksGateway.broadcastTaskCreated(task);
    return task;
  }

  @Patch('reorder')
  async reorder(@Body() body: { taskIds: number[] }) {
    return this.tasksService.reorder(body.taskIds);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      (updateTaskDto as any).attachmentUrl = file.filename;
    }
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.remove(id);
    this.tasksGateway.server.emit('task:deleted', { id });
    return { message: `Task ${id} deleted` };
  }
}
