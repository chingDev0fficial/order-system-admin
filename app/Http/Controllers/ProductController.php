<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

// request
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\AlterProductRequest;

// debugging function -> Log
use Illuminate\Support\Facades\Log;

// services
use App\Services\Product\CreateProductService;
use App\Services\Product\AlterProductService;
use App\Services\Product\DropProductService;
use App\Services\Product\FetchProductService;
use App\Services\Product\RenderProductPageService;

class ProductController extends Controller
{
    public function create(RenderProductPageService $service)
    {
        return Inertia::render('products', [
            'products' => $service->process()
        ]);
    }

    /**
     * this will store the created product to the data base
     * 
     * @param \App\Http\Requests\StoreProductRequest $request
     * @param \\App\Services\Product\CreateProductService $service
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(
        StoreProductRequest $request,
        CreateProductService $service
    )
    {
        $service->process($request->validated(), $request);
        return redirect()
                ->back()
                ->with('success', 'Product added successfully!');
    }

    /**
     * for altering (changing) product data
     * 
     * @param \Illuminate\Http\AlterProductRequest; $request
     * @param \App\Services\Product\AlterProductService $service
     * @return \Illuminate\Http\RedirectResponse
     */
    public function alter(
        AlterProductRequest $request,
        AlterProductService $service
    )
    {
        $validated = $request->validated();
        $service->process($validated, $request);
        return redirect()
                ->back()
                ->with('success', 'Product updated successfully!');
    }

    /**
     * for deleting product data
     * 
     * @param string $id
     * @param App\Services\Product\DropProductService $service
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id, DropProductService $service)
    {
        $service->process($id);
        return redirect()
                ->back()
                ->with('success', 'Product deleted successfully!');
    }

    /**
     * 
     * @param \Illuminate\Http\Request; $request
     * @param \App\Services\Product\FetchProductService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch(
        Request $request,
        FetchProductService $service
    )
    {
        $products = $service->process($request, false);

        return response()->json([
            'success' => true,
            'products' => $products
        ], 200);
    }


    // API REQUESTS FUNCTIONS

    /**
     * 
     * @param \Illuminate\Http\Request; $request
     * @param \App\Services\Product\FetchProductService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchAPI(
        Request $request,
        FetchProductService $service    
    )
    {
        $products = $service->process($request, true);

        return response()->json([
            'success' => true,
            'products' => $products
        ], 200);
    }
}
