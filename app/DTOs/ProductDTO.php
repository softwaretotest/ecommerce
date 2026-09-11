<?php

namespace App\DTOs;

final class ProductDTO
{
    public function __construct(
        public readonly ?string $name = null,
        public readonly ?string $image = null,
        public readonly ?int $shop_id = null,
        public readonly ?string $price = null,
        public readonly ?string $stock = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'] ?? null,
            image: $data['image'] ?? null,
            shop_id: $data['shop_id'] ?? null,
            price: $data['price'] ?? null,
            stock: $data['stock'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'image' => $this->image,
            'shop_id' => $this->shop_id,
            'price' => $this->price,
            'stock' => $this->stock,
        ];
    }
}
