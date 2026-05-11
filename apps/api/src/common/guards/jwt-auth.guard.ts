import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

    if (!token) {
      throw new UnauthorizedException("Token manquant");
    }

    try {
      request.user = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret"
      });
      return true;
    } catch {
      throw new UnauthorizedException("Token invalide");
    }
  }
}
