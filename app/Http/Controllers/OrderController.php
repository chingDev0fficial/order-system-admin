<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

// request
use App\Http\Requests\StoreOrderRequest;

// models
use App\Models\Order;
use App\Models\OrderedProduct;

// debugging function -> Log
use Illuminate\Support\Facades\Log;

// services
use App\Services\Order\CreateOrderService;
use App\Services\Order\RenderOrderPageService;

class OrderController extends Controller
{
    public function create($page, RenderOrderPageService $service)
    {
        return Inertia::render("order-pages/{$page}-orders", [
            'orders' => $service->process()
        ]);
    }

    /**
     * Store a newly created order in the database.
     * 
     * @param \App\Http\Requests\StoreOrderRequest $request
     * @param \App\Services\Order\CreateOrderService $service
     * @return \Illuminate\Http\RedirectResponse
     * 
     */
    public function order(
        StoreOrderRequest $request,
        CreateOrderService $service
    )
    {
        $service->process($request->validated());
        return redirect()
                ->back()
                ->with('success', 'Order created successfully!');
    }
}
