<?php

namespace App\Services;

use App\Models\User;
use RuntimeException;

class UserService
{
    public function findByEmail(string $email): User
    {
        $normalizedEmail = strtolower(trim($email));
        $user = User::query()->where('email', $normalizedEmail)->firstOrFail();

        return $this->assertActive($user);
    }

    public function canAccess(?User $user, string|int $ownerId): bool
    {
        if ($this->isDev($user)) {
            return true;
        }

        return $user !== null && (string) $user->id === (string) $ownerId;
    }

    public function isDev(?User $user): bool
    {
        if (!$user || !$user->is_active) {
            return false;
        }

        return in_array(strtolower($user->email), [
            'castermatt1@gmail.com',
            'kaybaancentro@gmail.com',
        ], true);
    }

    private function assertActive(User $user): User
    {
        if (!$user->is_active) {
            throw new RuntimeException('User account is inactive.');
        }

        return $user;
    }
}
