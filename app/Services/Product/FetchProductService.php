<?php

namespace App\Services\Product;

// models
use App\Models\Product;

class FetchProductService {
    
    public function process($request, $withAsset)
    {
        try
        {
            $query = Product::query();

            // Optional: Search functionality
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            }

            // Optional: Filter by status
            if ($request->has('id')) {
                $query->where('id', $request->input('id'));
            }

            // Optional: Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Optional: Filter by category
            if ($request->has('category')) {
                $query->where('category', $request->input('category'));
            }

            $products = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($product) use ($withAsset) {
                    return [
                        'productId' => $product->id,
                        'name' => $product->name,
                        'category' => $product->category,
                        'price' => $product->price,
                        'description' => $product->description,
                        'image' => $withAsset ? 
                                    asset("storage/$product->image") : $product->image,
                        'status' => $product->status,
                        'createdAt' => $product->created_at,
                        'updatedAt' => $product->updated_at
                    ];
                });

            return $products;
        }
        catch (\Exception $e)
        {
            \Log::error('Fetch product failed', ['exception' => $e]);
            throw new \Exception('Unable to fetch product');
        }
    }
}