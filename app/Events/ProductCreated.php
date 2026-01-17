<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// models
use App\Models\Product;

// debugging function -> Log
use Illuminate\Support\Facades\Log;

class ProductCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $product;

    /**
     * Create a new event instance.
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('products'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'product.created';
    }

    public function broadcastWith(): array
    {
        try
        {
            return [
                'productId' => $this->product->id,
                'name' => $this->product->name,
                'category' => $this->product->category,
                'price' => $this->product->price,
                'status' => $this->product->status,
            ];
        }
        catch (\Exception $e)
        {
            \Log::error("An error occurs: $e");
            return redirect()->back()->with('error', 'Error in pusher connection!');
        }
    }
}
