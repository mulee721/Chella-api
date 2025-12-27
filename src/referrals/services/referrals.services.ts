import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Referral } from "../schema/referrals.schema"; 
import { Model, Types } from "mongoose"; 
import { ReferredUserResponse, ReferrerResponse } from "../responses/referrals.responses";

    @Injectable()
    export class ReferralService {
        constructor(
          @InjectModel(Referral.name)//used to inject mangos moel into the service
          private readonly referralModel: Model<Referral>,  
        ) {}  

    async  createReferralTracking(refferrerId: string, referrerdUserId: string){
        //prevent self referral
        if(refferrerId === referrerdUserId){
          throw new BadRequestException("You cannot refer yourself");
        };

        //lets check if the referral already exists to prvent duplicate referrals
        const refExists = await this.referralModel.exists({
          referrerdUserId:referrerdUserId
        });
        if(refExists){
          throw new BadRequestException("user already referred");
        }
        const refferal = await this.referralModel.create({
          refferrerId: new Types.ObjectId(refferrerId),
          referrerdUserId: new Types.ObjectId(referrerdUserId)
        });
        return refferal.save();
    }
    async getMyReferrer(currentUser){
      const referral =await this.referralModel.findOne({ referrerdUserId:new Types.ObjectId(currentUser.id)}).populate('referrerId','username fullName createAt')

                  if(!referral){
                    throw new  BadRequestException("youu dont have a referre ")
                  }
                  const referrer =referral.referrerId as any;
                  console.log("Referral found",referral);
                  console.log("Referral found",referrer);
                  //use intercpter
            const referrerResponse:ReferrerResponse = {

              id:referral?._id.toString(),
              referredId:referrer?._id.toString(),
              referrerFullname:referrer?.fullName,
              referrerUsername:referrer?.username,
            }
                return referrerResponse;

                }

            async getMyreferredUsers(currentUser){
              const referrals =await this.referralModel.find({ referralId:new Types.ObjectId(currentUser.Id)}).populate('referredUserId','username fullName createAt')
                if(referrals.length ===0){
        return [];
                }

        const referredresponse:ReferredUserResponse[]=referrals.map(referral=>{
          const referredUser=referral.referrerdUserId as any;

        return {
            id:referral._id.toString(),
            referredUserId:referredUser?._id.toString(),
            referredUserFullname:referredUser?.fullName,
            referredUserUsername:referredUser?.username
        }


        })


        return referredresponse
            }


          }