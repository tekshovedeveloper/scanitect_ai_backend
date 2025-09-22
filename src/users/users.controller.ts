import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Public } from "../common/decorators";
import { LoggerService } from '../common/service/logger.service';
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Request, Response } from "express";
import {
  sendResponse,
  userErrorResponse,
  userListSuccessResponse,
  userSuccessResponse,
} from "../utils";
import { statusMessage } from "../constant/statusMessage";
import { HttpExceptionFilter } from "../utils/http-exception.filter";
import { UserRequest, responseData, userData } from "../interface/common";
import { AuthGuard } from "../common/guards/at.guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { v4 as uuid } from 'uuid';
import { EmailService } from '../common/service/mail.service';

@ApiTags("users")
@Controller("v1/users")
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly mailer: EmailService) { }

  @ApiOperation({
    summary: "Create user",
    description: "User signup app",
  })
  @ApiResponse(userSuccessResponse)
  @ApiResponse(userErrorResponse)
  @Public()
  @Post()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createCatDto: CreateUserDto,
    @Res() res: Response
  ): Promise<responseData> {
    const id: string = uuid();
    this.logger.log('User create api called', id, 'users.controler.ts', 'POST', '/users', 'create');
    const findUser = await this.userService.findOneUser(createCatDto.email);
    if(!findUser){
    const user = await this.userService.create(createCatDto);
    const isMAil = process.env.IS_EMAIL
    console.log('##############', isMAil)
    if (isMAil === "true") {
      await this.mailer.sendEmailVerification(user.email, user.email_code)
    }
    return sendResponse(
      res,
      HttpStatus.CREATED,
      statusMessage[HttpStatus.CREATED],
      true,
      user
    );
  }
  else{
      return sendResponse(
      res,
      HttpStatus.FORBIDDEN,
      statusMessage[HttpStatus.FORBIDDEN],
      false,
      {message: "user from this email is already created"}
    ); 
  }
  }

  // get user
  @ApiOperation({
    summary: "User List",
    description: "Get User List",
  })
  @ApiResponse(userListSuccessResponse)
  @ApiResponse({ status: 403, description: "Forbidden." })
  @UseGuards(AuthGuard)
  @Get()
  @UseFilters(new HttpExceptionFilter())
  async findAll(@Res() res: Response): Promise<userData[]> {
    const id: string = uuid();
    this.logger.log('User list api called', id, 'users.controler.ts', 'GET', '/users', 'findAll');
    const userList = await this.userService.findAll();
    return sendResponse(
      res,
      HttpStatus.OK,
      statusMessage[HttpStatus.OK],
      true,
      userList
    );
  }


 



@ApiOperation({
  summary: "Test API",
  description: "Simple API to test if backend is running",
})
@ApiResponse({ status: 200, description: "Backend is running" })
@Public()  // mark it public if you want it without auth guard
@Get('test')
testApi(@Res() res: Response): Response {
  this.logger.log('Test API called', 'simple-test-id', 'users.controller.ts', 'GET', '/users/test', 'testApi');
  return sendResponse(
    res,
    HttpStatus.OK,
    statusMessage[HttpStatus.OK],
    true,
    { message: "Backend is running!" }
  );
}










 

}
