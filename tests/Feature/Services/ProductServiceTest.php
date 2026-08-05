<?php

namespace Tests\Feature\Services;

use App\Constant\BaseConstraint;
use App\DTOs\ProductDTO;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase; // 🌟 เรียกใช้ Namespace เดียวกับที่คุณทำไว้เมื่อวาน
use Tests\TestCase;

class ProductServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ProductService $productService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->productService = app(ProductService::class);
    }

    /**
     * 1. Test ฟังก์ชัน create()
     */
    public function test_it_can_create_a_product_using_base_service(): void
    {
        $dto = new ProductDTO(
            name: 'Test Innovation',
            image_url: 'https://example.com/image.jpg'
        );

        $data = [
            'name' => $dto->name,
            'image_url' => $dto->image_url,
        ];

        $product = $this->productService->create($data);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals('Test Innovation', $product->name);
        $this->assertDatabaseHas('products', ['name' => 'Test Innovation']);
    }

    /**
     * 2. Test ฟังก์ชัน getById()
     */
    public function test_it_can_get_product_by_id(): void
    {
        $createdProduct = Product::create([
            'name' => 'Find Me',
            'image_url' => 'https://example.com/find.jpg'
        ]);

        $foundProduct = $this->productService->getById($createdProduct->id);

        $this->assertNotNull($foundProduct);
        $this->assertEquals($createdProduct->id, $foundProduct->id);
    }

    /**
     * 3. Test ฟังก์ชัน getAll()
     */
    public function test_it_can_get_all_products(): void
    {
        Product::create(['name' => 'Product A', 'image_url' => 'urlA']);
        Product::create(['name' => 'Product B', 'image_url' => 'urlB']);

        $products = $this->productService->getAll();

        $this->assertCount(2, $products);
    }

    /**
     * 4. Test ฟังก์ชัน delete()
     */
    public function test_it_can_delete_a_product_by_id(): void
    {
        // 🌟 ปรับปรุงจุดนี้: ใช้ substr และ BaseConstraint::NAME_MAX
        // เพื่อการันตีว่าชื่อสินค้าจำลองตัวนี้จะมีความยาวไม่เกินค่าสูงสุดที่กำหนดไว้ในโปรเจกต์แน่นอน
        $safeName = substr('Product To Delete', 0, BaseConstraint::NAME_MAX);

        $productToDelete = Product::create([
            'name' => $safeName,
            'image_url' => 'https://example.com/delete.jpg'
        ]);

        $this->assertDatabaseHas('products', ['id' => $productToDelete->id]);

        $this->productService->delete($productToDelete->id);

        $this->assertDatabaseMissing('products', ['id' => $productToDelete->id]);
    }
}
