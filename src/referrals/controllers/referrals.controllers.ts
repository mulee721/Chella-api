import { Controller, Get, Req } from "@nestjs/common";
import { ReferralService } from "../services/referrals.services";
import { JwtAuthGuard } from "src/commons/guards/jwt.auth.guards";

@Controller('referrals')
export class ReferralController{
    constructor (
                  private readonly referralService:ReferralService
    ){}

@JwtAuthGuard()

@Get('get-my-referrer')
    async getMyreferrer(@Req() req:any){
return await this.referralService.getMyReferrer(req.user)
    }


    @JwtAuthGuard()
    @Get('my-referred-users')
    async getMyreferredUsers(@Req() req:any){
        return await this.referralService.getMyreferredUsers(req.user);
    }
}
