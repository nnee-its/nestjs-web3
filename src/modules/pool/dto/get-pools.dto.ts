import { IsOptional, IsString } from "class-validator"
import { PaginationDto } from "src/dto/pagination.dto"

export class GetPoolsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  keyword?: string
}
