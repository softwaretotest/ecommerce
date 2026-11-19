<?php

namespace App\Services;

use App\Models\User;

class SelectProductService
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function canAccess(?User $user, string|int $ownerId): bool
    {
        if ($this->userService->isDev($user)) {
            return true;
        }

        return $user !== null && (string) $user->id === (string) $ownerId;
    }
}