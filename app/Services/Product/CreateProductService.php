<?php

namespace App\Services\Product;

// models
use App\Models\Product;

// job
use App\Jobs\ProcessProductCreation;

class CreateProductService {
    
    public function process(array $validated, $request)
    {
        try
        {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')
                                     ->store('products', 'public');
            }

            // Create product
            $product = Product::create([
                'name' => $validated['name'],
                'category' => $validated['category'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'image' => $imagePath,
            ]);

            // Dispatch job for async processing and broadcasting
            ProcessProductCreation::dispatch($product);
        }
        catch (\Exception $e)
        {
            \Log::error('Create product failed', ['exception' => $e]);
            throw new \Exception('Unable to create product');
        }
    }
}