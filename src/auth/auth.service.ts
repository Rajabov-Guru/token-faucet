import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from "bcryptjs";
import { User } from '../users/entities/user.entity';
import Token from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  @Inject(UsersService)
  private readonly userService:UsersService;

  @Inject(JwtService)
  private readonly jwtService:JwtService;

  @InjectRepository(Token)
  private readonly tokenRepository:Repository<Token>;


  async login(dto:CreateUserDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new HttpException("Can't find user profile. Try again", HttpStatus.BAD_REQUEST)
    }
    const isPassEquals = await bcrypt.compare(dto.password, user.password);
    if (!isPassEquals) {
      throw new HttpException("Invalid password", HttpStatus.BAD_REQUEST)
    }

    const tokens = await this.generateTokens(user);

    await this.saveToken(user.id, tokens.refreshToken);
    return {...tokens, user: user}
  }

  async logout(refreshToken:string) {
    const token = await this.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new HttpException("Invalid token1", HttpStatus.UNAUTHORIZED);
    }
    const userData = await this.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new HttpException("Invalid token2", HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.findOne(userData.id);

    const tokens = await this.generateTokens(user);

    await this.saveToken(user.id, tokens.refreshToken);
    return {...tokens, user}
  }

  async registration(dto:CreateUserDto) {
    const candidate = await this.userService.findByEmail(dto.email);
    if (candidate) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcrypt.hash(dto.password, 3);
    const user = await this.userService.create({...dto, password:hashPassword});

    const tokens = await this.generateTokens(user);
    await this.saveToken(user.id, tokens.refreshToken);

    return {...tokens, user};
  }



  private async generateTokens(user:User){
    const payload = {login:user.login,id:user.id};
    return {
      accessToken: this.jwtService.sign(payload,{secret: process.env.JWT_ACCESS_SECRET, expiresIn:'60s'}),
      refreshToken: this.jwtService.sign(payload,{secret: process.env.JWT_REFRESH_SECRET, expiresIn:'1h'})
    };
  }

  private async validateAccessToken(token:string){
    try {
      const userData = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET});
      return userData;
    } catch (e) {
      return null;
    }
  }

  private async validateRefreshToken(token:string){
    try {
      const userData = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET});
      return userData;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  async saveToken(userId:number, refreshToken:string) {/////??????
    const user = await this.userService.findOne(userId);
    const tokenData = await this.userService.getToken(userId);
    if (tokenData) {
      tokenData.refresh = refreshToken;
      user.token = tokenData;
      await this.userService.save(user);
      return tokenData;
    }
    const token = new Token();
    token.refresh = refreshToken;
    token.user = user;
    await this.tokenRepository.save(token);
    return token;
  }

  async removeToken(refreshToken) {
    const token = await this.findToken(refreshToken);
    return this.tokenRepository.remove(token);
  }

  async findToken(refreshToken) {
    return this.tokenRepository.findOneBy({refresh:refreshToken});
  }

  private async validateUser(dto:CreateUserDto){
    const user = await this.userService.findByEmail(dto.email);
    if(!user){
      throw new UnauthorizedException({message:"Incorrect nickname or password"});
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if(user && passwordEquals){
      return user;
    }
    else{
      throw new UnauthorizedException({message:"Incorrect nickname or password"});
    }
  }
}
