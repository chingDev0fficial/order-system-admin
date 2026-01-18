<?php

namespace App\Services\Product;

// models
use App\Models\Product;

class RenderProductPageService {

    public function process()
    {
        try
        {
            // Fetch products and pass to Inertia
            $products = Product::select('id', 'name', 'category', 'price', 'status')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($product) {
                    return [
                        'productId' => $product->id,
                        'name' => $product->name,
                        'category' => $product->category,
                        'price' => $product->price,
                        'status' => $product->status,
                    ];
                });

            return $products;
        }
        catch (\Exception $e)
        {
            \Log::error('Render product page failed', ['exception' => $e]);
            return [];
        }
    }
}