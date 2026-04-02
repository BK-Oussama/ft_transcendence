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
  StreamableFile,
  NotFoundException,
  Headers,
  ParseFilePipe, 
  MaxFileSizeValidator, 
  FileTypeValidator, 
  HttpStatus,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksGateway } from './tasks.gateway';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { TaskStatus } from './dto/task-status.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  @Get('uploads/:filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    const filePath = join(process.cwd(), 'uploads', filename);

    if (!existsSync(filePath))
      throw new NotFoundException('File not found on the server');

    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
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
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, 
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType: '.(jpg|jpeg|png|pdf|docx|mp4|mov|webm)$' }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    ) file: Express.Multer.File,
    @Req() req: any,
    @Headers() headers: any
  ) {
    if (file) {
      (createTaskDto as any).attachment_url = file.filename;
    }
    const realUserId = req.user.id;
    const task = await this.tasksService.create(createTaskDto, realUserId, headers);
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

  @Delete('project/:projectId')
  async cleanUpProjectTasks(@Param('projectId') projectId: string) {
    return this.tasksService.deleteAllTasksByProject(Number(projectId));
  }

  @Get('attachments/:fileName')
  @UseGuards(JwtAuthGuard)
  async downloadFile(
    @Param('fileName') fileName: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    const userId = req.user.id;

    const isMember = await this.tasksService.checkFileAccess(fileName, userId);

    if (!isMember) {
      throw new ForbiddenException('You do not have permission to view this file');
    }

    const filePath = join(__dirname, '..', '..', 'uploads', fileName);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File missing on server');
    }

    return res.sendFile(filePath);
  }
}
