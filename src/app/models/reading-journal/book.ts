import { Formats } from "../../enums/formats";
import { Genres } from "../../enums/genres";
import { Status } from "../../enums/status";
import { Author } from "./author";
import { Series } from "./series";

export class Book {
  id!: string;
  name?: string;
  author?: Author;
  pages?: number;
  currentPage?: number;
  startDate?: Date;
  endDate?: Date;
  genre?: Genres[];
  publisher?: string;
  format!: Formats;
  description?: string;
  review?: string;
  status!: Status;
  price!: number;
  series?: Series;

  constructor(init?: Partial<Book>) {
    Object.assign(this, init);
  }

  get progressPercentage(): number {
    if (this.pages && this.pages > 0 && this.currentPage) {
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