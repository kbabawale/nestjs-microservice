import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BankDTO {
    @ApiProperty({ example: 'First Bank', description: 'Bank Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '101', description: 'Bank Code' })
    code: string;
}