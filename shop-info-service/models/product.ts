export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
}

export interface NewProduct {
    title: string;
    description: string;
    price: number;
    count: number;
}