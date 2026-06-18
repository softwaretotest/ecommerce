<?php

namespace Database\Factories;

use App\Constant\BaseConstraint;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->word();
        if (strlen($name) > BaseConstraint::NAME_MAX) {
            $name = substr($name, 0, BaseConstraint::NAME_MAX);
        }

        return [
            'name' => $name,
            'image_url' => fake()->imageUrl(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'stock' => fake()->numberBetween(0, 100),
            'user_id' => User::factory(),
        ];
    }
}
