<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\GuestUserController;

Route::group(["prefix" => "guest"], function () {
    Route::post('/create', [GuestUserController::class, "store"]);
    Route::post('/update-alter', [GuestUserController::class, "updateAlter"]);

    Route::get('/fetch', [GuestUserController::class, "fetch"]);
});

Route::group(["prefix" => "orders"], function () {
    Route::post('/order-checkout', [OrderController::class, 'order']);
});

Route::group(["prefix" => "products"], function () {
    Route::get('/fetch', [ProductController::class, 'fetchAPI']);
});