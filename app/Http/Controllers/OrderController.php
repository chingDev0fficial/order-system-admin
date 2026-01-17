<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

// request
use App\Http\Requests\StoreOrderRequest;

// models
use App\Models\Order;
use App\Models\OrderedProduct;

// job
use App\Jobs\ProcessOrderCreation;

// debugging function -> Log
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function create($page)
    {
        try
        {
            // Fetch products and pass to Inertia
            $orders = Order::select('id', 'guest_user_id', 'total_price', 'status')
                ->with('guestUser:id,customer_name')
                ->where('status', $page)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'orderId' => $order->id,
                        'customer' => $order->guestUser->customer_name,
                        'totalPrice' => $order->total_price,
                        'status' => $order->status,
                    ];
                });

            return Inertia::render("order-pages/{$page}-orders", [
                'orders' => $orders
            ]);
        }  
        catch (\Exception $e)
        {
            \Log::info("An error occurs: $e");
            return Inertia::render("order-pages/{$page}-orders", ['orders' => []]);
        }
    }

    /**
     * Store a newly created order in the database.
     * 
     * @param \App\Http\Requests\StoreOrderRequest $request
     * @return \Illuminate\Http\RedirectResponse
     * 
     */
    public function order(StoreOrderRequest $request)
    {
        try
        {
            $validated = $request->validated();

            $order = Order::create([
                'guest_user_id' => $validated['guestUserId'],
                'total_price' => $validated['totalPrice'],
            ]);

            // Loop through multiple products
            foreach ($validated['products'] as $product) {
                OrderedProduct::create([
                    'order_id' => $order->id,
                    'product_id' => $product['productId'],
                    'quantity' => $product['quantity'],
                ]);
            }

            ProcessOrderCreation::dispatch($order);
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
}
