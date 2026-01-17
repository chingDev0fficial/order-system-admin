<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\OrderedProduct;
use App\Models\GuestUser;

class Order extends Model
{
    protected $table = "orders";

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

    protected $fillable = [
        'id',
        'guest_user_id',
        'total_price',
        'status',
    ];

    public function guestUser()
    {
        return $this->belongsTo(GuestUser::class, 'guest_user_id');
    }

    public function orderedProducts()
    {
        return $this->hasMany(OrderedProduct::class, 'order_id');
    }

    /**
     * Boot the model and generate unique ID.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->id)) {
                $order->id = self::generateUniqueId();
            }
        });
    }

    /**
     * Generate a unique product ID in format ORD-XXX
     */
    private static function generateUniqueId(): string
    {
        do {
            // Get the last product by ID
            $lastOrder = self::orderBy('id', 'desc')->first();
            
            if ($lastOrder) {
                // Extract the number from ORD-XXX
                $lastNumber = (int) substr($lastOrder->id, 4);
                $newNumber = $lastNumber + 1;
            } else {
                $newNumber = 1;
            }
            
            $newId = 'ORD-' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
            
        } while (self::where('id', $newId)->exists());
        
        return $newId;
    }
}
