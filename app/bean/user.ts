export class User {
    constructor(
        public id: number,
        public mobile: string,
        public realname: string,
        public password: string,
        public age: number,
        public status: number,
        public createdAt: string,
        public updatedAt: string,
    ) {}
}