import { Formats } from "../../enums/formats";
import { Genres } from "../../enums/genres";
import { Status } from "../../enums/status";
import { AuthorDTO } from "./authorDTO";
import { Series } from "./series";

export class BookDTO {
  id!: number;
  name!: string;
  authors!: AuthorDTO[];
  publisher!: string;
  genres!: Genres[];
  format!: Formats;
  pages!: number;
  currentPage?: number;
  startDate?: Date;
  endDate?: Date;
  status!: Status;
  price?: number;
  series?: Series;
  description?: string;
  review?: string;

  get progressPercentage(): number {
    if (this.pages > 0 && this.currentPage) {
      return Math.round((this.currentPage / this.pages) * 10000) / 100; // 2 casas decimais
    }
    return 0;
  }

  get daysSpentReading(): number {
    if (this.startDate && this.endDate) {
      const diffTime = this.endDate.getTime() - this.startDate.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }
}