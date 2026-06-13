import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date | undefined> {
    transform(value: string): Date | undefined {
        if (!value) {
            return undefined;
        }

        const timestamp = Date.parse(value);
        if (isNaN(timestamp)) {
            throw new BadRequestException(`"${value}" ist kein gültiges Datumsformat (nutze z.B. YYYY-MM-DD).`);
        }

        return new Date(timestamp);
    }
}