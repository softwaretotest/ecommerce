<?php

use App\Http\Controllers\RecordController;
use Illuminate\Support\Facades\Route;

Route::prefix('records')->group(function () {
    Route::get('{entity}', [RecordController::class, 'index']);
    Route::post('{entity}', [RecordController::class, 'store']);
    Route::put('{entity}/{id}', [RecordController::class, 'update']);
    Route::delete('{entity}/{id}', [RecordController::class, 'destroy']);
});
