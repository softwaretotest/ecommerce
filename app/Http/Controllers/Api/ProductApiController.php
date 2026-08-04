<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductApiController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * send all data to JSON
     */
    public function index(): JsonResponse
    {
        $products = $this->productService->getAll();

        return response()->json([
            'success' => true,
            'message' => 'Product list retrieved successfully ✅',
            'data' => $products
        ], 200);
    }
}
