import { PartialType } from '@nestjs/mapped-types';
import { CreateAutofaucetDto } from './create-autofaucet.dto';

export class UpdateAutofaucetDto extends PartialType(CreateAutofaucetDto) {}
