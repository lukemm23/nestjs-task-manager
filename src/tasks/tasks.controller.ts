// controller contracts different scenarios a route receives and forks it to the right service end point
import { Body, Controller, Get, Post, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {Task, TaskStatus} from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    // validation pipe inserted into query for filter optional, 
    // checking status correctness and search not empty and both optional
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
        if(Object.keys(filterDto).length){
            return this.tasksService.getTasksWithFilters(filterDto);
        }else{
            return this.tasksService.getAllTasks();
        }
       
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string){
        return this.tasksService.getTaskById(id);
    }

    // method 1: not specifying body parameter 
    // @Post()
    // createTask(@Body() body){
    //     console.log('body', body)
    // }

    // method 2: specifying body parameter
    // @Post()
    // createTask(
    //     @Body('title') title: string,
    //     @Body('description') description: string
    // ){
    //    return this.tasksService.createTask(title, description);
    // }



    //USING DTO
    @Post()
    //using DTO to validate data with pipe against DTO
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto
    ) : Task{
       return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id:string):void{
        this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id:string, 
        // custom validation pipe added to parameter status
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        ): Task{
        return this.tasksService.updateTaskStatus(id, status);
    }

}
