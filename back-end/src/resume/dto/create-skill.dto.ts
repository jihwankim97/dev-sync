import { IsNumber, IsString } from "class-validator";

export class CreateSkillDto {
    @IsNumber()
    id: number;
  
    @IsString()
    name: string;
  
    @IsString()
    icon: string;
}