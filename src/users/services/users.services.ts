import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, userLoginDto } from "../dtos/users.dto";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/users.schema";
import { UserResponse } from "../responses/users.responses";
import { CommonUtils } from "src/commons/Util";
import { access } from "fs";
import { ReferralService } from "src/referrals/services/referrals.services";

@Injectable()
export class UserService{

  constructor( 
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly referralService:ReferralService
  ){}

    async registerUser(createUserDto: CreateUserDto){

    // all logics wil be done here
    console.log("coming request body",createUserDto)
    //check if user exists
    const existingname=await this.userModel.findOne({
      username:createUserDto.username.toLocaleLowerCase()
    });
    console.log("existing name:",existingname)
    if(existingname){
      throw new BadRequestException("user already exists with this username")
    
    }
       

        let referringUser = null as any;
        
        if (createUserDto.referredBy) {
            referringUser = await this.userModel.findOne({ referralCode: createUserDto.referredBy});

            if (!referringUser) {
                throw new BadRequestException('Invalid referral code.');
            }
        }
        //hash password
        const hashedPwd= await bcrypt.hash(createUserDto.password,10);        
        //generate refferal
        const referralCode = CommonUtils.generateReferralCode();
        if(createUserDto.referredBy){
          const refferingUser =await this.userModel.findOne({
            referralCode:createUserDto.referredBy
              })
          if(refferingUser){
            await this.userModel.findByIdAndUpdate(
              refferingUser._id,{
                totalEarned:refferingUser.totalEarned+20,
                amount:refferingUser.amount+20,
                totalReferred:refferingUser.totalReferred+1
              }
            );
          }
        }
        //prepare an instance to save on db db
        const newUser=new this.userModel({
          fullname:createUserDto.fullname,
          username:createUserDto.username,
          password:hashedPwd,
          referredBy:createUserDto.referredBy||null,
          referralCode: referralCode,
          amount:100,
          totalEarned:100,
          totalReferred:0
        });
        //save to db
        const savedUser = await newUser.save();

        //! We will implement a code to increase amount for referering users
        if(referringUser){
            await this.referralService.createReferralTracking(
                referringUser._id.toString(),
                savedUser._id.toString()
            )

            await this.userModel.findByIdAndUpdate(referringUser._id, {
                totalEarned: referringUser.totalEarned + 20,
                amount: referringUser.amount + 20,
                totalReffered: referringUser.totalReffered + 1
            });
        }
        //map to our user responsee intercepter
            const UserResponse:UserResponse ={
            id:savedUser._id.toString(),
            fullName:savedUser.fullname,
            username:savedUser.username,
             referralCode:savedUser.referralCode,
            refferedBy:savedUser.referedBy,
            amount:savedUser.amount,
            totalEarned:savedUser.totalEarned,
            totalReferred:savedUser.totalReferred
           }
        //send back response
        return UserResponse;
    }

    //UPDATE THE USER SERVICE****
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    //chack user table
    const user = await this.userModel.findById(id);
    if (!user) {
      {
        throw new BadRequestException('user dos not exist');
      }
    }
    //preparing thing
    if (updateUserDto.fullname) {
      user.fullname = updateUserDto.fullname;
    }
    //check if username is exist with provided user name
    if (updateUserDto.username) {
      const existUsername = await this.userModel.findOne({
        username: updateUserDto.username.toLowerCase(),
      });
      if (existUsername && existUsername.username !== user.username) {
        throw new BadRequestException('username already exist');
      }
      user.username = updateUserDto.username.toLowerCase();
    }

    //update username
    //save to db
    const updatedUser = await user.save();
    //map to response
    const userResponse: UserResponse = {
      id: updatedUser._id.toString(),
      fullName: updatedUser.fullname,
      username: updatedUser.username,
      referralCode: updatedUser.referralCode,
     refferedBy: updatedUser.referedBy,
      amount: updatedUser.amount,
      totalEarned: updatedUser.totalEarned,
      totalReferred: updatedUser.totalReferred,
    };
    //return response
    return userResponse;
  }
  //GET SINGLE PROFILE*****************************************************************************************
  async getUserProfile(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('user dos not exist');
    }
    //if user exists
    const userResponse: UserResponse = {
      id: user._id.toString(),
      fullName: user.fullname,
      username: user.username,
      referralCode: user.referralCode,
      refferedBy: user.referedBy,
       amount: user.amount,
       totalEarned: user.totalEarned,
       totalReferred: user.totalReferred
    };
    return userResponse;
  }
  //get all user
  async getAllUsers(){
const users =await this.userModel.find();
//2 if no users found return empty listneat
if(!users||users.length ===0){
  return[];
}
//3 usssing our response interceptor
const userResponse:UserResponse[]=users.map((user)=>({
id: user._id.toString(),
      fullName: user.fullname,
      username: user.username,
      referralCode: user.referralCode,
     refferedBy: user.referedBy,
      amount: user.amount,
      totalEarned: user.totalEarned,
      totalReferred: user.totalReferred,
}))
return userResponse;
  }

//Auth service 
// loginservice
async userLogin(userLoginDto:userLoginDto){
  const user =await this.userModel.findOne({
    username:userLoginDto.username.toLocaleLowerCase(),
  });
  if(!user){
    throw new BadRequestException("Invalid username provided");
  }
  

  //comparing password
  const isPwdMatch =await bcrypt.compare(userLoginDto.password,user.password);
  if(!isPwdMatch){
    throw new BadRequestException("Incorrect password");
  }

//3 generating a token
const jwtData={
  id:user._id.toString(),fullname:user.fullname,username:user.username
}

const generateToken =CommonUtils.generateJwtToken(jwtData);
console.log("GENERATED TOKEN",generateToken);


return{
  accessToken:generateToken,
}
}
//service to fetch my own refferal code
async getMyReferralCode(currentUser){
  const user =await this.userModel.findById(currentUser.id);
  if(!user){
   throw new BadGatewayException("user does not exist");

  }
  const userResponse:UserResponse={
    referralCode:user.referralCode,
  }
  return userResponse;

}
    }


    