<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Collection;

class PermitService
{
    private const DEV_EMAILS = [
        'castermatt1@gmail.com',
        'kaybaancentro@gmail.com',
    ];

    /** @var array<int, Shop|null> */
    private array $shop_cache = [];

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    /**
     * Dev user can bypass all permission checks.
     */
    public function is_dev(User $user): bool
    {
        if (empty($user->email)) {
            return false;
        }

        return in_array(
            strtolower($user->email),
            self::DEV_EMAILS,
            true
        );
    }

    /**
     * Get shop IDs owned by user (all shops if dev).
     */
    public function shop_ids(User $user): Collection
    {
        if ($this->is_dev($user)) {
            return Shop::query()->pluck('id');
        }

        return Shop::query()
            ->where('user_id', $user->id)
            ->pluck('id');
    }

    /**
     * Check if user owns the shop.
     */
    public function is_shop_owner(User $user, int $shop_id): bool
    {
        if ($this->is_dev($user)) {
            return true;
        }

        if (!array_key_exists($shop_id, $this->shop_cache)) {
            $this->shop_cache[$shop_id] = Shop::query()->find($shop_id);
        }

        $shop = $this->shop_cache[$shop_id];

        if ($shop === null) {
            return false;
        }

        return $shop->user_id === $user->id;
    }

    // -------------------------------------------------------------------------
    // SHOPS
    // -------------------------------------------------------------------------

    /**
     * Dev or shop owner can create update delete own shop.
     */
    public function can_crud_shop(User $user, Shop $shop): bool
    {
        if ($this->is_dev($user)) {
            return true;
        }

        if (
            isset($shop->user_id)
            && $shop->user_id !== $user->id
        ) {
            return false;
        }

        return $shop->user_id === $user->id;
    }

    // -------------------------------------------------------------------------
    // PRODUCTS
    // -------------------------------------------------------------------------

    /**
     * Shop owner can create update delete product in own shop.
     */
    public function can_crud_product(User $user, Product $product): bool
    {
        if ($this->is_dev($user)) {
            return true;
        }

        if (
            isset($product->user_id)
            && $product->user_id !== $user->id
        ) {
            return false;
        }

        return $this->is_shop_owner($user, $product->shop_id);
    }

    /**
     * Build UI permission flags sent to frontend for product list/card.
     */
    public function product_ui_permit(User $user, Product $product): array
    {
        $can_manage = $this->can_crud_product($user, $product);

        return [
            'can_show' => true,
            'can_update' => $can_manage,
            'can_delete' => $can_manage,
        ];
    }
}
