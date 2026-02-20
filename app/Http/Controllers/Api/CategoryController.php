<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::withCount('posts')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $category = Category::with(['posts' => function ($query) {
            $query->with('user')
                ->whereNotNull('published_at')
                ->orderBy('published_at', 'desc');
        }])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($category);
    }
}
