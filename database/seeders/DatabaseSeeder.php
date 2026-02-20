<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar los seeders en orden correcto:
        // 1. Primero las categorías (sin dependencias)
        // 2. Luego los usuarios (sin dependencias)
        // 3. Finalmente los posts (dependen de usuarios y categorías)
        
        $this->call([
            CategorySeeder::class,
            UserSeeder::class,
            PostSeeder::class,
        ]);
    }
}
