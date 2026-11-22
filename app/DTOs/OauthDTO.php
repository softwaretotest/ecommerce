<?php

namespace App\DTOs;

final class OauthDTO extends BaseDTO
{
    public function __construct(
        public readonly ?int $user_id = null,
        public readonly ?string $account_type = null,
        public readonly ?string $open_auth_uid = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            user_id: $data['user_id'] ?? null,
            account_type: $data['account_type'] ?? null,
            open_auth_uid: $data['open_auth_uid'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->user_id,
            'account_type' => $this->account_type,
            'open_auth_uid' => $this->open_auth_uid,
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
            'open_auth_uid' => [
                'type' => 'string',
                'php_type' => 'string',
                'input' => NULL,
                'ui' => NULL,
                'params' => [
                    'length' => 255
                ],
                'required' => false,
                'default' => NULL,
                'rules' => 'nullable|string|max:255'
            ],
        ];
    }
}
