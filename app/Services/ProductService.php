<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

class ProductService
{
    public function __construct(
        private readonly PermitService $permit_service,
    ) {}

    public function index_for_user(?User $user, ?int $shop_id = null): Collection
    {
        $shop_ids = $this->permit_service->shop_ids($user);

        $query = Product::query();

        if ($shop_id !== null) {
            if (!$this->permit_service->is_dev($user) && !$shop_ids->contains($shop_id)) {
                return collect();
            }
            $query->where('shop_id', $shop_id);
        } elseif (!$this->permit_service->is_dev($user)) {
            if ($shop_ids->isEmpty()) {
                return collect();
            }
            $query->whereIn('shop_id', $shop_ids);
        }

        return $query->get()->map(function (Product $product) use ($user) {
            $flags = $this->permit_service->product_ui_permit($user, $product);

            foreach ($flags as $key => $value) {
                $product->setAttribute($key, $value);
            }

            return $product;
        });
    }
}
