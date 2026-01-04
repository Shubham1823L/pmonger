export type ProductStatus = "Draft" | "Published"

export type Product = {
    name: string,
    avatarPublicId: string,
    stock: number,
    minimumStock: number,
    description:string,
    category: string,
    price: number,
    status: ProductStatus,
    id: string,
    createdAt: Date,
    updatedAt: Date,
    ownerId: string
}
