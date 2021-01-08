// class validator is used to validate data rules against incoming data
import {IsNotEmpty} from 'class-validator';

// data transfer object: sets model to task data object
export class CreateTaskDto{
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
}