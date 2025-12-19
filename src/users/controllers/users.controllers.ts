import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UserService } from '../services/users.services';
import { CreateUserDto, UpdateUserDto, userLoginDto } from '../dtos/users.dto';
import { get } from 'mongoose';
import { JwtAuthGuard } from 'src/commons/guards/jwt.auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.registerUser(createUserDto);

    return result;
  }

  @Patch('update-profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.userService.updateUser(id, updateUserDto);
    return result;
  }

  @Get('get-profile/:id')
  async getUserProfile(@Param('id') id: string) {
    const result = await this.userService.getUserProfile(id);
    return result;
  }

  //@JwtAuthGuard()
  @Get('get-all')
  async getAllUsers(@Req() req: any) {
    console.log('USER INFO:', req.user);
    const result = await this.userService.getAllUsers();
    return result;
  }

  @Post('login')
  async userLogin(@Body() userLoginDto: userLoginDto) {
    const result = await this.userService.userLogin(userLoginDto);
    return result;
  }
  //
  @JwtAuthGuard()
  @Get('/my-referal-code')
async getMyReferalCode(@Req() req:any
){
  const result =await this.userService.getMyReferralCode(req.user)
  return result;
}
}
