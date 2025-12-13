import { Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document{
    @Prop()
    fullname:string;
      @Prop()
    username:string;
      @Prop()
    password:string;
      @Prop()
    referedBy:string;
      @Prop()
    referralCode:string;
      @Prop()
    amount:number;
      @Prop()
    totalEarned:number;
      @Prop()
    totalReferred:number;

}
export const userSchema = SchemaFactory.createForClass(User);