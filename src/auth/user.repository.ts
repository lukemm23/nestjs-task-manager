import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import {EntityRepository, Repository} from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {User} from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredentialsDto:AuthCredentialsDto):Promise<void>{
        const {username, password} = authCredentialsDto

        //1. validating username is unique by using a second query
        // const exists = this.findOne({username});
        // if(exists){
        //     // ... throw some error
        // }

        // 2. validate username is unique at database level see entity @Unique(['username']) then try catch from save()
        // to prevent nest from sending 500 error       

        // setting a new entity
        const user = new User();
        user.username = username;
        user.password = password;

        try{
            await user.save();
        }catch(error){
            if(error.code === '23505'){ // error.code 23505 is for duplicate username
                throw new ConflictException('Username already exists')
            }else{
                throw new InternalServerErrorException();
            }
        }
        
    }

}