import { IsAlpha, IsNotEmpty, IsOptional, IsString ,} from "class-validator";

export class CreateUserDto {  
    @IsString()
    fullname:string;
    @IsString()
    username:string;
    @IsString()
    password:string;
    @IsString()
    @IsOptional()
    referredBy:string;
}
export class UpdateUserDto{
  @IsString()
  @IsOptional()
  fullname: string;
  @IsString()
  @IsOptional()
  username: string;

}
export class userLoginDto{
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  username: string;
}