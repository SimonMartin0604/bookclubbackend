import { IsDateString, IsEnum, IsNotEmpty } from "class-validator";

enum member_gender{
    F = "F",
    M = "M"
}

export class CreateMemberDto {
    @IsNotEmpty()
    name!: string;

    @IsEnum(member_gender)
    gender!: member_gender;

    @IsNotEmpty()
    @IsDateString()
    birth_date!: Date
}
