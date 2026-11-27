<?php

use App\Http\Controllers\Auth\Google_Session_Controller;
use App\Http\Controllers\RecordController;
use Illuminate\Support\Facades\Route;

Route::prefix('records')->group(function () {
    Route::get('/{entity}', [RecordController::class, 'index']);
    Route::post('/{entity}', [RecordController::class, 'store']);
    Route::put('/{entity}/{id}', [RecordController::class, 'update']);
    Route::delete('/{entity}/{id}', [RecordController::class, 'destroy']);
});

Route::middleware('web')->group(function () {
    Route::get('/auth/me', [Google_Session_Controller::class, 'me']);
    Route::post('/auth/google', [Google_Session_Controller::class, 'login_With_Google']);
    Route::post('/auth/logout', [Google_Session_Controller::class, 'destroy']);
});
