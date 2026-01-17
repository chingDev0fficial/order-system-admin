<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Order;
use App\Models\Product;

class OrderedProduct extends Model
{
    protected $table = "ordered_products";

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'order_id',
        'product_id',
        'quantity',
        'status',
        'reason_of_cancelation',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Boot the model and generate unique ID.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($orderedProduct) {
            if (empty($orderedProduct->id)) {
                $orderedProduct->id = self::generateUniqueId();
            }
        });
    }

    /**
     * Generate a unique product ID in format ORDPRD-XXX
     */
    private static function generateUniqueId(): string
    {
        do {
            // Get the last product by ID
            $lastOrderedProduct = self::orderBy('id', 'desc')->first();
            
            if ($lastOrderedProduct) {
                // Extract the number from ORDPRD-XXX
                $lastNumber = (int) substr($lastOrderedProduct->id, 7);
                $newNumber = $lastNumber + 1;
            } else {
                $newNumber = 1;
            }
            
            $newId = 'ORDPRD-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
            
        } while (self::where('id', $newId)->exists());
        
        return $newId;
    }
}
