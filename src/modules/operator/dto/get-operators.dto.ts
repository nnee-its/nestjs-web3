import { IsOptional, IsString } from "class-validator"
import { PaginationDto } from "src/dto/pagination.dto"

export class GetOperatorsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  keyword?: string
}
