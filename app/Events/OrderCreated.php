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
use App\Models\Order;

class OrderCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $order;

    /**
     * Create a new event instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('orders'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.created';
    }

    public function broadcastWith(): array
    {
        try
        {
            return [
                'orderId' => $this->order->id,
                'customer' => $this->order->guestUser->customer_name,
                'totalPrice' => $this->order->total_price,
                'status' => $this->order->status,
                'image' => asset('storage/products/' . $this->order->image),
            ];
        }
        catch (\Exception $e)
        {
            \Log::error("An error occurs: $e");
            return redirect()->back()->with('error', 'Error in pusher connection!');
        }
    }
}
