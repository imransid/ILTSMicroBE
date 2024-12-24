import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gplContext = GqlExecutionContext.create(context);

    const { req } = gplContext.getContext();

    const accessTokenWith = req.headers.authorization as string;

    const accessToken = accessTokenWith.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Please login to access this resource.!');
    }

    if (accessToken) {
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException('Invalid access token');
      }

      await this.updateAccessToken(req, decoded, accessToken);
    }

    return true;
  }

  private async updateAccessToken(
    req: any,
    decoded: any,
    token: any,
  ): Promise<void> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      req.accesstoken = token;
      req.user = user;
    } catch (error) {}
  }
}
