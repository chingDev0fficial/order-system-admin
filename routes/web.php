<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// controllers
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::group(['prefix' => '/'], function () {
        Route::get('/', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
    });

    Route::group(['prefix' => 'orders'], function () {
        Route::get('/{page}', [OrderController::class, 'create']);

    });

    Route::group(['prefix' => 'products'], function () {
        Route::get('/', [ProductController::class, 'create']);
        Route::get('/fetch', [ProductController::class, 'fetch']);

        Route::post('/submit', [ProductController::class, 'store']);
        Route::post('/edit', [ProductController::class, 'alter']);

        Route::delete('/delete/{id}', [ProductController::class, 'destroy']);
    });
});

require __DIR__.'/settings.php';
