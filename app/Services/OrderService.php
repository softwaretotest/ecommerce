<?php

namespace App\Services;

use App\Models\User;

class OrderService
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function canCreate(?User $user, array $payload): bool
    {
        if ($this->userService->isDev($user)) {
            return true;
        }

        return $user !== null
            && isset($payload['user_id'])
            && (string) $payload['user_id'] === (string) $user->id;
    }

    public function canUpdate(?User $user, ?array $shop): bool
    {
        if ($this->userService->isDev($user)) {
            return true;
        }

        return $user !== null
            && $shop !== null
            && isset($shop['user_id'])
            && (string) $shop['user_id'] === (string) $user->id;
    }

    public function canDelete(?User $user): bool
    {
        return $this->userService->isDev($user);
    }
}