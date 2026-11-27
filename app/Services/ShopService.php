<?php

namespace App\Services;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Collection;

class ShopService
{
    public function __construct(private readonly UserService $userService) {}

    public function shop_ids(?User $user): Collection
    {
        if ($user === null) {
            return collect();
        }

        if ($this->userService->isDev($user)) {
            return Shop::query()->pluck('id');
        }

        return Shop::query()
            ->where('user_id', $user->id)
            ->pluck('id');
    }

    public function shop_owner(?User $user, Shop|array|null $shop): bool
    {
        if ($user === null || $shop === null) {
            return false;
        }

        if ($this->userService->isDev($user)) {
            return true;
        }

        $owner_id = is_array($shop) ? ($shop['user_id'] ?? null) : $shop->user_id;

        return $owner_id !== null && (string) $owner_id === (string) $user->id;
    }

    public function can_create(?User $user, array $payload): bool
    {
        if ($this->userService->isDev($user)) {
            return true;
        }

        return $user !== null
            && isset($payload['user_id'])
            && (string) $payload['user_id'] === (string) $user->id;
    }

    public function can_update(?User $user, array $shop, array $payload): bool
    {
        if ($this->userService->isDev($user)) {
            return true;
        }

        return $user !== null
            && isset($shop['user_id'], $payload['user_id'])
            && (string) $shop['user_id'] === (string) $user->id
            && (string) $payload['user_id'] === (string) $shop['user_id'];
    }

    public function can_delete(?User $user, array $shop): bool
    {
        if ($this->userService->isDev($user)) {
            return true;
        }

        return $user !== null
            && isset($shop['user_id'])
            && (string) $shop['user_id'] === (string) $user->id;
    }
}
