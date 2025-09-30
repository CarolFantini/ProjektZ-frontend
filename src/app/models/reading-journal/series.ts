import { Author } from "./author";
import { Book } from "./book";

export class Series {
  id!: number;
  name?: string;

  constructor(init?: Partial<Series>) {
    Object.assign(this, init);
  }
}