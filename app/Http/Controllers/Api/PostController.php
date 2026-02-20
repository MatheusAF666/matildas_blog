<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with(['user', 'categories'])
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $post = Post::with(['user', 'categories'])
            ->where('slug', $slug)
            ->whereNotNull('published_at')
            ->firstOrFail();

        return response()->json($post);
    }
}
