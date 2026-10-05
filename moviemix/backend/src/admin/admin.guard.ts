import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const { user } = ctx.switchToHttp().getRequest();
    if (user?.role !== 'admin') throw new ForbiddenException('Admin access required');
    return true;
  }
}
