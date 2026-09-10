<?php

namespace App\DTOs;

class ShopDTO
{
    public $name = null;
    public $image = null;
    public $user_id = null;


    public static function fromArray(array $data)
    {
        return new self([
            'name' => $data['name'] ?? null,
            'image' => $data['image'] ?? null,
            'user_id' => $data['user_id'] ?? null,

        ]);
    }
}
