<?php

namespace App\Jobs;

use App\Events\ProductCreated;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessProductCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $product;

    /**
     * Create a new job instance.
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try
        {
            // Broadcast the event
            broadcast(new ProductCreated($this->product))->toOthers();

            // You can add more logic here:
            // - Send email notifications
            // - Update inventory systems
            // - Generate product codes
            // - Update search indexes

        }
        catch (\Exception $e)
        {
            \Log::error('Error processing product creation', [
                'product_id' => $this->product->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
