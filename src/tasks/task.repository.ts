import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "./task.entity";
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

// using repository as extra layer for persistence, and only store database logic
@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    // custom get tasks repository with extended logic of getting tasks with or without filters/search
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        const {status, search} = filterDto;

        // using query builder: used when the logic is more sophiscated than simple typeorm methods
        const query = this.createQueryBuilder('task');

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

        const tasks = await query.getMany();
        return tasks;
    }

    // custom create task repository method for persistence
    async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
        const {title, description} = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }
}