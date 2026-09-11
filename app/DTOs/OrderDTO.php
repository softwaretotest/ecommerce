<?php

namespace App\DTOs;

final class OrderDTO
{
    public function __construct(
        public readonly ?string $order_nr = null,
        public readonly ?int $product_id = null,
        public readonly ?string $quantity = null,
        public readonly ?bool $confirm_order = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            order_nr: $data['order_nr'] ?? null,
            product_id: $data['product_id'] ?? null,
            quantity: $data['quantity'] ?? null,
            confirm_order: $data['confirm_order'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'order_nr' => $this->order_nr,
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'confirm_order' => $this->confirm_order,
        ];
    }
}
