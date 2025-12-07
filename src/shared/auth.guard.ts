import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException({
        message: '未授权',
        code: HttpStatus.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
      }, HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: 'L82CFMmY9xhXgWPU'
        }
      );
      // 💡 我们在这里将 payload 分配给 request 对象
      // 以便我们可以在路由处理程序中访问它
      request['user'] = payload;
    } catch {
      throw new HttpException({
        message: '未授权',
        code: HttpStatus.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
      }, HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}