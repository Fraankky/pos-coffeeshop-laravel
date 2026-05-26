<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('menu_item_id')->constrained()->restrictOnDelete();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->text('customization_notes')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->string('size', 20)->default('regular');
            $table->json('toppings')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('menu_item_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
