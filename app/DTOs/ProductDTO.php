<?php

namespace App\DTOs;

readonly class ProductDTO
{
     public function __construct(
          public string $name,
          public ?string $image_url = null,
     ) {}
}
