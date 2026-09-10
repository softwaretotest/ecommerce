<?php

namespace App\DTOs;

class UserDTO
{
    public $name = null;
    public $image = null;
    public $email = null;
    public $is_active = null;


    public static function fromArray(array $data)
    {
        return new self([
            'name' => $data['name'] ?? null,
            'image' => $data['image'] ?? null,
            'email' => $data['email'] ?? null,
            'is_active' => $data['is_active'] ?? null,

        ]);
    }
}
