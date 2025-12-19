import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Referral, referralSchema } from './schema/referrals.schema';
import { ReferralService } from './services/referrals.services';
import { ReferralController } from './controllers/referrals.controllers';

@Module({
 imports:[
        MongooseModule.forFeature([
        
            { name: Referral.name, schema: referralSchema}

        ])
    ],
    controllers:[ReferralController],
    providers: [ ReferralService],
    

})

export class ReferralsModule {}
