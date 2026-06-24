<?php
// route/api.php
use App\Http\Controllers\Api\ProductApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\M_Controller;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/products', [ProductApiController::class, 'index']);

// Endpoint for the UI to fetch the metadata JSON
Route::get('/m-data', [M_Controller::class, 'getMetadata']);
