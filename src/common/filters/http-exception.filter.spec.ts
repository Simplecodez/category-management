import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let response: Response;
  let request: Request;
  let host: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter]
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    // Mock the request and response objects
    request = { url: '/test' } as Request;
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    // Mock ArgumentsHost
    host = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response
      })
    } as unknown as ArgumentsHost;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Forbidden', 403);

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      status: 'fail',
      statusCode: 403,
      message: 'Forbidden',
      timestamp: expect.any(String),
      path: '/test'
    });
  });

  it('should handle QueryFailedError with unique violation error code', () => {
    const exception = new QueryFailedError('query', ['message'], {
      code: '23505'
    } as any);

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      status: 'fail',
      statusCode: 500,
      message: 'Label already exists in this category',
      timestamp: expect.any(String),
      path: '/test'
    });
  });

  it('should handle QueryFailedError with other error code', () => {
    const exception = new QueryFailedError('query', ['message'], {
      code: '12345'
    } as any);

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      status: 'fail',
      statusCode: 500,
      message: 'Internal Server Error',
      timestamp: expect.any(String),
      path: '/test'
    });
  });

  it('should handle QueryFailedError without driverError', () => {
    const exception = new QueryFailedError('query', ['message'], {} as any);

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      status: 'fail',
      statusCode: 500,
      message: 'Internal Server Error',
      timestamp: expect.any(String),
      path: '/test'
    });
  });
});
