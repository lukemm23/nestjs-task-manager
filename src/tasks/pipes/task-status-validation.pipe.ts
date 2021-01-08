// this pipe validates status when trying to update task status.
import {BadRequestException, PipeTransform} from '@nestjs/common';
import {TaskStatus} from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value:any){
    // this will take care of lower cased status param erroring by mistake
    value = value.toUpperCase();

    // if isStatusValid return -1, will throw error
    if(!this.isStatusValid(value)){
        throw new BadRequestException(`"${value}" is an invalid status`);
    }

        return value;
    }


    private isStatusValid(status:any){
        // will return -1 if status is not inside allowedStatuses array
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}