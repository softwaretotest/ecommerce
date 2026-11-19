<?php

namespace App\Services;

use App\Models\User;

class ProductService
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function canCreate(?User $user, array $payload, ?array $shop): bool
    {
        if ($this->userService->isDev($user)) {
            return true;
        }

        return $user !== null
            && isset($payload['user_id'], $payload['shop_id'])
            && (string) $payload['user_id'] === (string) $user->id
            && $shop !== null
            && isset($shop['user_id'])
            && (string) $shop['user_id'] === (string) $user->id;
    }

    public function canUpdate(?User $user, array $product): bool
    {
        if ($this->userService->isDev($user)) {
            return true;
        }

        return $user !== null
            && isset($product['user_id'])
            && (string) $product['user_id'] === (string) $user->id;
    }

    public function canDelete(?User $user, array $product): bool
    {
        return $this->canUpdate($user, $product);
    }
}