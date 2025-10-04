export class AuthorDTO {
    id!: number;
    name?: string;

    constructor(init?: Partial<AuthorDTO>) {
        Object.assign(this, init);
    }
}