import { Expose, Type } from 'class-transformer';

export class CommentResponseDto {
    @Expose()
    id: number;

    @Expose()
    author: string;

    @Expose()
    body: string;

    @Expose()
    @Type(() => Date)
    createdAt: Date;
}