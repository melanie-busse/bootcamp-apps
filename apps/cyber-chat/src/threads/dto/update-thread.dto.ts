import { PartialType } from '@nestjs/mapped-types';
import { CreateThreadDto } from './create-thread.dto';

// Erbt alle Regeln von CreateThreadDto, macht sie aber optional (?) für PATCH
export class UpdateThreadDto extends PartialType(CreateThreadDto) {}