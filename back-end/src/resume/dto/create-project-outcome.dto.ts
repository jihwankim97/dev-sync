import { IsString, IsNotEmpty, IsUUID, } from 'class-validator';

export class CreateOutcomeDto {
 
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  task: string;

  @IsString()
  @IsNotEmpty()
  result: string;

}
