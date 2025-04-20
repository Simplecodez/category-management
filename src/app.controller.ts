import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Returns a welcome message'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a string'
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
