import { Expose, Type } from 'class-transformer';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';

export class ThreadResponseDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    body: string;

    @Expose()
    author: string;

    @Expose()
    @Type(() => Date) // Erzwingt die Serialisierung als echtes Date-Objekt
    createdAt: Date;

    @Expose()
    @Type(() => CommentResponseDto) // Verschachtelte Serialisierung für die Kommentare
    comments?: CommentResponseDto[];
}