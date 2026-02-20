<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todas las categorías
        $categories = Category::all();

        // Crear posts y asociarlos con categorías aleatorias
        Post::factory(50)->create()->each(function ($post) use ($categories) {
            // Asociar entre 1 y 5 categorías aleatorias a cada post
            $post->categories()->attach(
                $categories->random(random_int(1, 3))->pluck('id')->toArray()
            );
        });
    }
}
