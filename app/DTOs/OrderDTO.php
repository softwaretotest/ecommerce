<?php

namespace App\DTOs;

class OrderDTO
{
    public $order_nr = null;
    public $product_id = null;
    public $quantity = null;
    public $confirm_order = null;


    public static function fromArray(array $data)
    {
        return new self([
            'order_nr' => $data['order_nr'] ?? null,
            'product_id' => $data['product_id'] ?? null,
            'quantity' => $data['quantity'] ?? null,
            'confirm_order' => $data['confirm_order'] ?? null,

        ]);
    }
}
