import { ObjectId } from "mongodb";

export default class Wine {
    constructor(
        public name: string,
        public stock: number,
        public last_buy: number,
        public picture: string,
        public description: string,
        public category_id: number,
        public id?: ObjectId,) {}
}