import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MainUserDataDTO } from "./dto/mainUserData.dto";
import * as bcrypt from 'bcrypt';
import { TokenPairDTO } from "./dto/tokenPair.dto";
import { SignInUserDTO } from "./dto/signInUser.dto";
import { SignUpUserDTO } from "./dto/signUpUser.dto";
import { UserEntity } from "src/entities/user/user.entity";


const HASH_ROUNDS = 3;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    name: string,
    password: string,
  ): Promise<MainUserDataDTO | null> {
    console.log('validateUser');
    const lowCaseName = name.toLowerCase();
    const user = await this.userRepository.findOne({
      where: { name: lowCaseName },
    });

    if (!user) return null;
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) return null;

    return {
      id: user.id,
      name: user.name,
    };
  }

  async getUser(userId: number): Promise<MainUserDataDTO> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException();
    return {
      id: user.id,
      name: user.name,
    };
  }

  async login(user: any): Promise<TokenPairDTO> {
    const payload = { name: user.name, sub: user.id };
    return{ accessToken: this.jwtService.sign(payload) };
  }

  async registry(user: SignUpUserDTO): Promise<UserEntity> {
    const nameInLowerCase = user.name.toLowerCase();
    const searchedUser = await this.userRepository.findOne({
      where: { name: nameInLowerCase },
    });

    console.log('=================================================');

    if(searchedUser) throw new NotFoundException();

    const encryptedPass = await bcrypt.hash(user.password, HASH_ROUNDS);
    return await this.userRepository.save({
      name: nameInLowerCase,
      password: encryptedPass,
    });
  }
}