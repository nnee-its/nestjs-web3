import { Type } from "class-transformer"
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator"
import { PoolSocial } from "../types/pool-social.dto"

export class CreatePoolDto {
  @IsString()
  @IsNotEmpty()
  projectName: string

  @IsNumber()
  @Min(0)
  idoPrice: number

  @IsNumber()
  @Min(0)
  totalRaise: number

  @IsString()
  @IsNotEmpty()
  tokenName: string

  @IsString()
  @IsNotEmpty()
  tokenNetwork: string

  @IsString()
  @IsNotEmpty()
  idoNetwork: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PoolSocial)
  socials: PoolSocial[]
}
