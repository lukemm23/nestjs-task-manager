// service receives direction from controller and performs route end point business logic
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
@Injectable()

export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){}

    async getTasks(
        filterDto:GetTasksFilterDto,
        user:User,
        ):Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id:number, user:User):Promise<Task>{
        const found = await this.taskRepository.findOne({where:{id, userId: user.id} });

        if(!found){
            // throw exception with custom error message when task with provided id is not found 
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user:User,
        ):Promise<Task>{

        //handled by repository of persistent data for database
        return this.taskRepository.createTask(createTaskDto, user);
    }
    

    async deleteTask(id:number, user:User):Promise<void>{
        //typeorm delete method passes element inside entity 
        // ie.id and delete and return raw or effected types (recomended for performance instead of remove method) 
        const result = await this.taskRepository.delete({id, userId: user.id});

        if(result.affected === 0){
            // throw exception with custom error message when task with provided id is not found (affected is 0)
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    //setting aways setting return type as promise because its a syncronous method
    async updateTaskStatus(id:number, status: TaskStatus,  user:User):Promise<Task>{
        // calling get by id function to get task first
        const task = await this.getTaskById(id, user);
        // updating status status 
        task.status = status;
        await task.save();
        return task;
    }

}
