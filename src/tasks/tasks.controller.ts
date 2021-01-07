import { Body, Controller, Get, Post, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {Task, TaskStatus} from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
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
    updateTaskStatus(@Param('id') id:string, @Body('status') status: TaskStatus){
        return this.tasksService.updateTaskStatus(id, status);
    }

}
