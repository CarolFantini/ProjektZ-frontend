import { Book } from "./book";

export class Author {
    id!: number;
    name?: string;

    constructor(init?: Partial<Author>) {
        Object.assign(this, init);
    }
}