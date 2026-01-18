<?php

namespace App\Services\Product;

// models
use App\Models\Product;

// job
use App\Jobs\ProcessProductDelete;

// accesing storage -> Storage
use Illuminate\Support\Facades\Storage;

class DropProductService {
    
    public function process(string $id)
    {
        try
        {
            $product = Product::findOrFail($id);
            
            // Delete the image file if it exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            
            // Delete the product
            $product->delete();
            
            ProcessProductDelete::dispatch($id);
        }
        catch (\Exception $e)
        {
            \Log::error('Drop product failed', ['exception' => $e]);
            throw new \Exception('Unable to drop product');
        }
    }
}