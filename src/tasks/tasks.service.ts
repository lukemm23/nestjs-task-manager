// service receives direction from controller and performs route end point business logic
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
@Injectable()

export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){}

    async getTasks(filterDto:GetTasksFilterDto):Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id:number):Promise<Task>{
        const found = await this.taskRepository.findOne(id);

        if(!found){
            // throw exception with custom error message when task with provided id is not found 
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found
    }

    async createTask(createTaskDto: CreateTaskDto):Promise<Task>{

        //handled by repository of persistent data for database
        return this.taskRepository.createTask(createTaskDto);
    }
    

    async deleteTask(id:number):Promise<void>{
        //typeorm delete method passes element inside entity 
        // ie.id and delete and return raw or effected types (recomended for performance instead of remove method) 
        const result = await this.taskRepository.delete(id);

        if(result.affected === 0){
            // throw exception with custom error message when task with provided id is not found (affected is 0)
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    //setting aways setting return type as promise because its a syncronous method
    async updateTaskStatus(id:number, status: TaskStatus):Promise<Task>{
        // calling get by id function to get task first
        const task = await this.getTaskById(id);
        // updating status status 
        task.status = status;
        await task.save();
        return task;
    }

}
