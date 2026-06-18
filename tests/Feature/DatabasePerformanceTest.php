<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * RUN THIS TEST:
 * php artisan test --filter=DatabasePerformanceTest
 */
class DatabasePerformanceTest extends TestCase
{
    protected static $isSeeded = false;

    /**
     * เตรียมข้อมูล 100,000 แถวอัตโนมัติก่อนเริ่มทำ Test
     */
    protected function setUp(): void
    {
        parent::setUp();

        // ตรวจสอบเพื่อไม่ให้เกิดการ Seed ซ้ำในการรันแต่ละ Method (รันรอบเดียวพอ)
        if (!self::$isSeeded) {
            $orderCount = Order::count();

            if ($orderCount < 100000) {
                echo "\n[System] กำลังเตรียมข้อมูลจำลอง 100,000 แถวสำหรับทดสอบ...\n";
                $this->runDynamicSeeder();
            } else {
                echo "\n[System] ตรวจพบข้อมูลในตารางแล้วจำนวน {$orderCount} แถว (ข้ามขั้นตอน Seeding)\n";
            }

            self::$isSeeded = true;
        }
    }

    /**
     * TEST 1: วัดความเร็วการค้นหาแบบระบุตัว (Lookup)
     * เปรียบเทียบระหว่าง Primary Key (Surrogate ID) และ order_nr (Business ID)
     */
    public function test_compare_lookup_performance()
    {
        $targetOrder = Order::inRandomOrder()->first();

        if (!$targetOrder) {
            $this->markTestSkipped('ไม่มีข้อมูลในตารางสำหรับใช้ทดสอบ');
        }

        // 1. วัดความเร็ว Surrogate ID (Primary Key)
        $startId = microtime(true);
        Order::find($targetOrder->id);
        $timeId = microtime(true) - $startId;

        // 2. วัดความเร็ว Business ID (order_nr)
        $startNr = microtime(true);
        Order::where('order_nr', $targetOrder->order_nr)->first();
        $timeNr = microtime(true) - $startNr;

        echo "\n===================================\n";
        echo " LOOKUP PERFORMANCE TEST\n";
        echo "===================================\n";
        echo "Surrogate ID (PK) took: " . number_format($timeId, 6) . " seconds\n";
        echo "Business ID (String) took : " . number_format($timeNr, 6) . " seconds\n";
        echo "-----------------------------------\n";

        $this->assertTrue(true);
    }

    /**
     * TEST 2: วัดความเร็วการฟิลเตอร์หาข้อมูลย่อยภายในตาราง
     * เปรียบเทียบระหว่างสแกนด้วยฐานข้อมูล (Database-side) กับการถอดรหัส String ด้วย PHP (Application-side)
     */
    public function test_compare_filtering_method()
    {
        $user = User::inRandomOrder()->first();
        $product = Product::inRandomOrder()->first();

        if (!$user || !$product) {
            $this->markTestSkipped('ข้อมูล User หรือ Product ไม่เพียงพอต่อการทดสอบ');
        }

        // 1. Database-side filtering (สแกนแบบพึ่งพาโครงสร้าง DB ปกติ)
        $startDb = microtime(true);
        $countDb = Order::where('user_id', $user->id)
                        ->where('product_id', $product->id)
                        ->count();
        $timeDb = microtime(true) - $startDb;

        // 2. Application-side filtering (ดึงก้อนใหญ่มาแล้วให้ PHP ทำลายสถิติ split ตัวแปร)
        $startPhp = microtime(true);
        $allOrders = Order::where('user_id', $user->id)->get();

        $countPhp = $allOrders->filter(function ($order) use ($product) {
            // ถอดรหัส String ID ตามกฎ (Convention) ของคุณ
            $parts = explode('_', $order->order_nr);
            return (isset($parts[2]) && $parts[2] == $product->id);
        })->count();
        $timePhp = microtime(true) - $startPhp;

        echo "\n===================================\n";
        echo " FILTERING PERFORMANCE TEST\n";
        echo "===================================\n";
        echo "Database-side (Eloquent) took: " . number_format($timeDb, 6) . "s (Result: $countDb)\n";
        echo "Application-side (PHP Filter) took: " . number_format($timePhp, 6) . "s (Result: $countPhp)\n";
        echo "-----------------------------------\n\n";

        $this->assertTrue(true);
    }

    /**
     * ฟังก์ชันภายในสำหรับจัดการ Seeding ข้อมูล
     */
    private function runDynamicSeeder(): void
    {
        $startTime = microtime(true);
        $userIds = DB::table('users')->pluck('id')->toArray();
        $productIds = DB::table('products')->pluck('id')->toArray();

        if (empty($userIds) || empty($productIds)) {
            echo "[Warning] กรุณา Seed ข้อมูลในตาราง users และ products ก่อนรัน test นี้!\n";
            return;
        }

        $batchSize = 5000;
        $orders = [];

        for ($i = 0; $i < 100000; $i++) {
            // สุ่มค่าเตรียมไว้ก่อน เพื่อให้ค่าในคอลัมน์กับค่าใน String ตรงกัน 100%
            $randomUserId = $userIds[array_rand($userIds)];
            $randomProductId = $productIds[array_rand($productIds)];

            // รูปแบบ: [Loop_Index]_[User_ID]_[Product_ID]_[Timestamp]
            $uniqueNr = ($i + 1) . '_' . $randomUserId . '_' . $randomProductId . '_' . time();

            $orders[] = [
                'user_id'    => $randomUserId,
                'product_id' => $randomProductId,
                'order_nr'   => $uniqueNr,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($orders) >= $batchSize) {
                Order::insert($orders);
                $orders = [];
            }
        }

        if (!empty($orders)) {
            Order::insert($orders);
        }

        $executionTime = microtime(true) - $startTime;
        echo "[Success] Seeding 100,000 แถวเสร็จสิ้น! ใช้เวลา: " . number_format($executionTime, 2) . " วินาที\n";
    }
}
