import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controllers';
import { UserService } from './services/users.services';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schemas/users.schema';
import { ReferralService } from 'src/referrals/services/referrals.services';
import { Referral, referralSchema } from 'src/referrals/schema/referrals.schema';

@Module({
    imports:[
        MongooseModule.forFeature([
            { name: User.name, schema: userSchema},
            { name: Referral.name, schema: referralSchema}

        ])
    ],
    controllers:[UsersController],
    providers:[UserService,
        ReferralService
    ],
exports:[ReferralService]

})
export class UsersModule {}
