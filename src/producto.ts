export interface Producto {
    title: string
    price: number
    thumbnail: string
    id: string
  }

export class Producto {
    constructor(title: string, price: number, thumbnail: string, id: string) {
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
        this.id = id
    }
}