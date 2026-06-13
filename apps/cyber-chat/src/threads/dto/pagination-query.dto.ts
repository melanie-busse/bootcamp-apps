import { IsInt, Min, Max, IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit: number = 10;

    // BONUS: Sortierung
    @IsOptional()
    @IsString()
    @IsIn(['createdAt', '-createdAt'], { message: 'Sortierung darf nur "createdAt" oder "-createdAt" sein.' })
    sort: string = '-createdAt'; // Standard: Neueste zuerst

    // BONUS: Filterung nach Autor
    @IsOptional()
    @IsString()
    author?: string;
}