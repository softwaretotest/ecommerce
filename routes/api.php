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

/**
 * do not remove middleware('web') , because if in middleware statefulApi() = off,
 * these points are necessary
 * 1. login_With_Google() must save login session
 * 2. destroy (logout) must clean session
 */
Route::middleware('web')->group(function () {
    Route::get('/auth/me', [Google_Session_Controller::class, 'me']);
    Route::post('/auth/google', [Google_Session_Controller::class, 'login_With_Google']);
    Route::post('/auth/logout', [Google_Session_Controller::class, 'destroy']);
});
