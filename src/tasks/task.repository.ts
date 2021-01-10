import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "./task.entity";
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import {User} from '../auth/user.entity';
import {InternalServerErrorException, Logger} from '@nestjs/common';

// using repository as extra layer for persistence, and only store database logic
@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    private logger = new Logger('TaskRepository');
    // custom get tasks repository with extended logic of getting tasks with or without filters/search
    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User,
        ): Promise<Task[]>{
        const {status, search} = filterDto;

        // using query builder: used when the logic is more sophiscated than simple typeorm methods
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', {userId: user.id})

        if(status){
            // first argument provide structure, second argument brings in params variable of status
            // by using andWhere method instead of where method multiple params do not override each other. 
            query.andWhere('task.status = :status', {status}) 
        }
        if(search){
            // using {search: `%${search}%`} syntax to allow search for not 100% exact matches
            // andWhere is like a where statement inside postgreSQL
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`}); 
        }

        try{
            const tasks = await query.getMany();
            return tasks;
        }catch(error){
            this.logger.error(`Failed to get tasks for user "${user.username}", 
            Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
            
        }

       
    }

    // custom create task repository method for persistence
    async createTask(
        createTaskDto: CreateTaskDto,
        user:User,
        ): Promise<Task>{
        const {title, description} = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try{
            await task.save();
        }catch(error){
            this.logger.error(`Failed to create a task for user "${user.username}", 
            data: ${JSON.stringify(createTaskDto)}`, error.stack);
            throw new InternalServerErrorException();
            
        }
        
        //deleting user property returned back for security
        delete task.user;

        return task;
    }
}