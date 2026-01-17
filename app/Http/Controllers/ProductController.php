<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

// job
use App\Jobs\ProcessProductCreation;
use App\Jobs\ProcessProductUpdate;
use App\Jobs\ProcessProductDelete;

// models
use App\Models\Product;

// request
use App\Http\Requests\StoreProductRequest;

// debugging function -> Log
use Illuminate\Support\Facades\Log;

// accesing storage -> Storage
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function create()
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

            return Inertia::render('products', [
                'products' => $products
            ]);
        }
        catch (\Exception $e)
        {
            Log::error("An error occurs: $e");
            return Inertia::render('products', ['products' => []]);
        }
    }

    /**
     * this will store the created product to the data base
     * 
     * @param \App\Http\Requests\StoreProductRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreProductRequest $request)
    {
        try
        {
            $validated = $request->validated();

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('products', 'public');
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

            return redirect()->back()->with('success', 'Product added successfully!');
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            throw $e;
        }
        catch (\Exception $e)
        {
            \Log::info("An error occurs $e");
            return redirect()->back()->with('error', 'Error while submitting product');
        }
    }

    /**
     * for altering (changing) product data
     * 
     * @param \Illuminate\Http\Request; $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function alter(Request $request)
    {
        try
        {
            $validated = $request->validated();

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

            return redirect()->back()->with('success', 'Product updated successfully!');
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            throw $e;
        }
        catch (\Exception $e)
        {
            \Log::info("An error occurs $e");
            return redirect()->back()->with('error', 'Error while updating product');
        }
    }

    /**
     * for deleting product data
     * 
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
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
            
            return redirect()->back()->with('success', 'Product deleted successfully!');
        }
        catch (\Exception $e)
        {
            \Log::error("Error deleting product: $e");
            return redirect()->back()->with('error', 'Error while deleting product');
        }
    }

    /**
     * helper function for fetching product data
     * 
     * Used by {@see fetch()} and {@see fetchAPI()}.
     * 
     * @param \Illuminate\Http\Request; $request
     * @param bool $withAsset
     * 
     * @return \Illuminate\Support\Collection
     * 
     */
    private function getProducts(Request $request, $withAsset = false)
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

    /**
     * 
     * @param \Illuminate\Http\Request; $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch(Request $request)
    {
        try
        {
            $products = $this->getProducts($request, false);

            return response()->json([
                'success' => true,
                'products' => $products
            ], 200);
        }
        catch (\Exception $e)
        {
            \Log::info("An error occurs $e");
            return response()->json([
                'success' => false,
                'message' => 'Error while fetching products'
            ], 500);
        }
    }


    // API REQUESTS FUNCTIONS

    /**
     * 
     * @param \Illuminate\Http\Request; $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchAPI(Request $request)
    {
        try
        {
            $products = $this->getProducts($request, true);

            return response()->json([
                'success' => true,
                'products' => $products
            ], 200);
        }
        catch (\Exception $e)
        {
            \Log::info("An error occurs $e");
            return response()->json([
                'success' => false,
                'message' => 'Error while fetching products'
            ], 500);
        }
    }
}
