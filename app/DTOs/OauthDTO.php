<?php

namespace App\DTOs;

final class OauthDTO extends BaseDTO
{
    public function __construct(
        public readonly ?int $user_id = null,
        public readonly ?string $account_type = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            user_id: $data['user_id'] ?? null,
            account_type: $data['account_type'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->user_id,
            'account_type' => $this->account_type,
        ];
    }

    public static function getMetadata(): array
    {
        return [
            'user_id' => [
                'type' => 'foreign',
                'php_type' => 'int',
                'input' => NULL,
                'ui' => NULL,
                'params' => [],
                'required' => false,
                'default' => NULL,
                'rules' => 'nullable|integer|exists:users,id'
            ],
            'account_type' => [
                'type' => 'string',
                'php_type' => 'string',
                'input' => 'text',
                'ui' => NULL,
                'params' => [
                    'length' => 255
                ],
                'required' => true,
                'default' => NULL,
                'rules' => 'required|string|max:255'
            ],
        ];
    }
}
