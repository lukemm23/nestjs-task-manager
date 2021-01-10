// controller contracts different scenarios a route receives and forks it to the right service end point
import { Body, Controller, Get, Post, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import {Task} from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService){}

    // validation pipe inserted into query for filter optional, 
    // checking status correctness and search not empty and both optional
    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user:User,
        ){
      return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id:number,
        @GetUser() user:User,
        ):Promise<Task>{
        return this.tasksService.getTaskById(id, user);
    }

    // // method 1: not specifying body parameter 
    // // @Post()
    // // createTask(@Body() body){
    // //     console.log('body', body)
    // // }

    // // method 2: specifying body parameter
    // // @Post()
    // // createTask(
    // //     @Body('title') title: string,
    // //     @Body('description') description: string
    // // ){
    // //    return this.tasksService.createTask(title, description);
    // // }



    // //USING DTO
    @Post()
    //using DTO to validate data with pipe against DTO
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user:User,
        ):Promise<Task>{
       return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id:number, @GetUser() user:User):Promise<void>{
        return this.tasksService.deleteTask(id, user);
    }

    // custom validation pipe added to parameter status
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id:number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user:User,
        ):Promise<Task>{
        return this.tasksService.updateTaskStatus(id, status, user);
    }

}
