<?php

namespace App\Services\Order;

// models
use App\Models\Order;

// job
use App\Jobs\ProcessOrderCreation;

class CreateOrderService {

    public function process(array $validated)
    {
        try
        {
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
        catch (\Exception $e)
        {
            \Log::error('Alter product failed', ['exception' => $e]);
            throw new \Exception('Unable to alter/update product');
        }
    }
}