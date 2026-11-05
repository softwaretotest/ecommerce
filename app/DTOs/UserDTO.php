<?php

namespace App\DTOs;

final class UserDTO extends BaseDTO
{
    public function __construct(
        public readonly ?bool $is_active = true,
        public readonly ?string $image = '',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            is_active: $data['is_active'] ?? true,
            image: $data['image'] ?? '',
        );
    }

    public function toArray(): array
    {
        return [
            'is_active' => $this->is_active,
            'image' => $this->image,
        ];
    }

    public static function getMetadata(): array
    {
        return [
            'is_active' => [
                'type' => 'boolean',
                'php_type' => 'bool',
                'input' => 'select',
                'ui' => NULL,
                'params' => [],
                'required' => false,
                'default' => true,
                'rules' => 'nullable|boolean'
            ],
            'image' => [
                'type' => 'string',
                'php_type' => 'string',
                'input' => 'file',
                'ui' => NULL,
                'params' => [
                    'length' => 255
                ],
                'required' => false,
                'default' => '',
                'rules' => 'nullable|string|max:255'
            ],
        ];
    }
}
