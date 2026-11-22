<?php

namespace App\DTOs;

final class Select_productDTO extends BaseDTO
{
    public function __construct(
        public readonly ?int $product_id = null,
        public readonly ?string $quantity = '1',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            product_id: $data['product_id'] ?? null,
            quantity: $data['quantity'] ?? '1',
        );
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
        ];
    }

    public static function getMetadata(): array
    {
        return [
            'product_id' => [
                'type' => 'foreign',
                'php_type' => 'int',
                'input' => NULL,
                'ui' => NULL,
                'params' => [],
                'required' => false,
                'default' => NULL,
                'rules' => 'nullable|integer|exists:products,id'
            ],
            'quantity' => [
                'type' => 'decimal',
                'php_type' => 'string',
                'input' => 'number',
                'ui' => NULL,
                'params' => [
                    'total_digits' => 10,
                    'scale' => 2
                ],
                'required' => true,
                'default' => '1',
                'rules' => 'required|numeric|decimal:0,2|max:99999999.99'
            ],
        ];
    }
}
