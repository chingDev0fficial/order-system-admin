<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

// events
use App\Events\OrderCreated;

// models
use App\Models\Order;

class ProcessOrderCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $order;

    /**
     * Create a new job instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try
        {
            // Broadcast the event
            broadcast(new OrderCreated($this->order))->toOthers();

            // You can add more logic here:
            // - Send email notifications
            // - Update inventory systems
            // - Generate product codes
            // - Update search indexes
        }
        catch (\Exception $e)
        {
            \Log::error('Error processing product creation', [
                'product_id' => $this->order->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
