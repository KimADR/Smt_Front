import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator'

export enum MouvementTypeDto {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export class CreateMouvementDto {
  @IsInt()
  @Min(1)
  entrepriseId!: number

  @IsEnum(MouvementTypeDto)
  type!: MouvementTypeDto

  @IsNumber()
  @IsPositive()
  amount!: number

  @IsOptional()
  @IsString()
  description?: string
}


