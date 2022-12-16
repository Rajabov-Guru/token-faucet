import { PartialType } from '@nestjs/mapped-types';
import { CreateHandfaucetDto } from './create-handfaucet.dto';

export class UpdateHandfaucetDto extends PartialType(CreateHandfaucetDto) {}
