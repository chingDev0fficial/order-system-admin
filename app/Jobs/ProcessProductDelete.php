<?php

namespace App\Jobs;

use App\Events\ProductDeleted;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessProductDelete implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $productId;

    /**
     * Create a new job instance.
     */
    public function __construct($productId)
    {
        $this->productId = $productId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try
        {
            // Broadcast the event
            broadcast(new ProductDeleted($this->productId))->toOthers();

            // You can add more logic here:
            // - Send email notifications
            // - Update inventory systems
            // - Generate product codes
            // - Update search indexes
        }
        catch (\Exception $e)
        {
            \Log::error('Error processing product update', [
                'product_id' => $this->productId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
