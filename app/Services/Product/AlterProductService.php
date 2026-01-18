<?php

namespace App\Services\Product;

// models
use App\Models\Product;

// job
use App\Jobs\ProcessProductUpdate;

class AlterProductService {

    public function process(array $validated, $request)
    {
        try
        {
            $product = Product::findOrFail($validated['id']);
            $product->name = $validated['name'];
            $product->category = $validated['category'];
            $product->description = $validated['description'];
            $product->price = $validated['price'];
            if ($request->hasFile('image')) {
                $product->image = $request->file('image')->store('products', 'public');
            }
            $product->status = $validated['status'];
            $product->save();

            ProcessProductUpdate::dispatch($product);
        }
        catch (\Exception $e)
        {
            \Log::error('Alter product failed', ['exception' => $e]);
            throw new \Exception('Unable to alter/update product');
        }
    }
}