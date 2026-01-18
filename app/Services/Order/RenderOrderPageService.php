<?php

namespace App\Services\Order;

// models
use App\Models\Order;

class RenderOrderPageService {

    public function process()
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

            return $orders;
        }  
        catch (\Exception $e)
        {
            \Log::error('Render order page failed', ['exception' => $e]);
            return [];
        }
    }
}