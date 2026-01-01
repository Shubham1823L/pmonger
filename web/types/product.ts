export type ProductStatus = "Draft" | "Published"

export type Product = {
    name: string,
    avatarPublicId: string | null,
    stock: number,
    price: number,
    status: ProductStatus,
    id: string,
    createdAt: Date,
    updatedAt: Date,
    ownerId: string
}
