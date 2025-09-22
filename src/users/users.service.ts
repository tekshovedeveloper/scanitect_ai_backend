import { Injectable } from "@nestjs/common";
import { LoggerService } from '../common/service/logger.service';
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./schemas/user.schema";
import { RefresToken } from "./schemas/refreshtoken.schema";
import * as bcrypt from "bcrypt";
import { userData } from "src/interface/common";
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(RefresToken.name)
    private readonly RefresTokenModel: Model<RefresToken>,
    private readonly logger: LoggerService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    console.log("the user for signup", createUserDto)
    
    const id: string = uuid();
    this.logger.log('User service create called', id, 'users.service.ts', '', '', 'create-service');
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds
    );
    createUserDto.password = hashedPassword;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const expiry = new Date(Date.now() + 5 * 60 * 1000);
   

     const createdUser = await this.userModel.create({
    ...createUserDto,
    otp,
    otpExpiry: expiry,
  });


  
 console.log(`✅ OTP for ${createdUser.email}: ${otp} (expires in 5 mins)`);

  
    return createdUser;
  }

  async findAll(): Promise<userData[]> {
    const id: string = uuid();
    this.logger.log('User service findall called', id, 'users.service.ts', '', '', 'findAll-service');
    return this.userModel.find().exec();
  }

  async findOne(id: string, projection = {}): Promise<userData> {
    return this.userModel.findOne({ _id: id }, projection).exec();
  }

  async findOneUser(email: string): Promise<userData> {
    return this.userModel.findOne({ email: email }).exec();
  }
  async delete(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedUser;
  }

  async updateOne(userId: Types.ObjectId | String, data: userData) {
    await this.userModel.updateOne({ _id: userId }, data);
  }

  async createRefreshToken(createUserDto: CreateUserDto): Promise<Boolean> {
    const createduUser = await this.RefresTokenModel.create(createUserDto);
    return true;
  }
}
