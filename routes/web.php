<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return 'Project M is Running!';
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});
