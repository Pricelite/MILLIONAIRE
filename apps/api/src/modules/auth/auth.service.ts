import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";

import { AppRole } from "../../common/enums/role.enum";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

type InMemoryUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: AppRole;
};

@Injectable()
export class AuthService {
  private readonly users = new Map<string, InMemoryUser>();

  constructor(private readonly jwtService: JwtService) {
    const founderHash = bcrypt.hashSync("Anthony45", 10);
    const managerHash = bcrypt.hashSync("Demo12345!", 10);

    this.users.set("antoniwelh@gmail.com", {
      id: "u-founder",
      email: "antoniwelh@gmail.com",
      passwordHash: founderHash,
      role: AppRole.SUPER_ADMIN
    });

    this.users.set("admin@restomaster.dev", {
      id: "u-manager",
      email: "admin@restomaster.dev",
      passwordHash: managerHash,
      role: AppRole.MANAGER
    });
  }

  async register(dto: RegisterDto) {
    const existing = this.users.get(dto.email);
    if (existing) {
      throw new UnauthorizedException("Email deja utilise");
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user: InMemoryUser = {
      id: `u-${Date.now()}`,
      email: dto.email,
      passwordHash: hash,
      role: (dto.role as AppRole) ?? AppRole.MANAGER
    };

    this.users.set(dto.email, user);
    return this.createSession(user);
  }

  async login(dto: LoginDto) {
    const user = this.users.get(dto.email);
    if (!user) {
      throw new UnauthorizedException("Identifiants invalides");
    }

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException("Identifiants invalides");
    }

    return this.createSession(user);
  }

  refresh(refreshToken: string) {
    const payload = this.jwtService.verify<{ sub: string; email: string; role: AppRole }>(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret"
    });

    return this.createSession({
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      passwordHash: ""
    });
  }

  forgotPassword(email: string) {
    return {
      message: "Si le compte existe, un email de reset a ete envoye",
      email
    };
  }

  resetPassword() {
    return { message: "Mot de passe reinitialise" };
  }

  verifyEmail() {
    return { message: "Email verifie" };
  }

  private createSession(user: InMemoryUser) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret", expiresIn: "15m" }
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret", expiresIn: "30d" }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}
