import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controllers';
import { UserService } from './services/users.services';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schemas/users.schema';

@Module({
    imports:[
        MongooseModule.forFeature([
            { name:'User', schema: userSchema}
        ])
    ],
    controllers:[UsersController],
    providers:[UserService]

})
export class UsersModule {}
