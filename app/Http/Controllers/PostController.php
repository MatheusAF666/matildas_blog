<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(){
        $posts = Post::with(['user', 'categories'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($posts);
    }
    
    public function show($id){
        $post = Post::with(['user', 'categories'])->findOrFail($id);
        return response()->json($post);
    }
    
    public function store(Request $request){
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:posts,slug|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'published_at' => 'nullable|date',
            'user_id' => 'required|exists:users,id',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id'
        ]);

        // Manejar la subida de imagen
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        // Crear el post
        $post = Post::create([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'content' => $data['content'],
            'image_path' => $imagePath,
            'meta_title' => $data['meta_title'] ?? null,
            'meta_description' => $data['meta_description'] ?? null,
            'published_at' => $data['published_at'] ?? null,
            'user_id' => $data['user_id'],
        ]);

        // Sincronizar categorías
        if (isset($data['categories'])) {
            $post->categories()->sync($data['categories']);
        }

        return response()->json($post->load(['user', 'categories']), 201);
    }
    
    public function update(Request $request, $id){
        $post = Post::findOrFail($id);
        
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:posts,slug,' . $post->id,
            'content' => 'sometimes|required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
            'remove_image' => 'nullable|boolean', // Para indicar si se debe eliminar la imagen
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'published_at' => 'nullable|date',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id'
        ]);

        // Manejar la imagen
        $imagePath = $post->image_path;
        
        // Si se sube una nueva imagen
        if ($request->hasFile('image')) {
            // Eliminar la imagen anterior si existe
            if ($post->image_path && Storage::disk('public')->exists($post->image_path)) {
                Storage::disk('public')->delete($post->image_path);
            }
            // Guardar la nueva imagen
            $imagePath = $request->file('image')->store('posts', 'public');
        } 
        // Si se marca para eliminar la imagen
        elseif ($request->input('remove_image') === true || $request->input('remove_image') === 'true') {
            if ($post->image_path && Storage::disk('public')->exists($post->image_path)) {
                Storage::disk('public')->delete($post->image_path);
            }
            $imagePath = null;
        }

        // Actualizar el post
        $post->update(array_filter([
            'title' => $data['title'] ?? $post->title,
            'slug' => $data['slug'] ?? $post->slug,
            'content' => $data['content'] ?? $post->content,
            'image_path' => $imagePath,
            'meta_title' => $data['meta_title'] ?? $post->meta_title,
            'meta_description' => $data['meta_description'] ?? $post->meta_description,
            'published_at' => array_key_exists('published_at', $data) ? $data['published_at'] : $post->published_at,
        ], function($value) {
            return $value !== null;
        }));

        // Sincronizar categorías
        if (isset($data['categories'])) {
            $post->categories()->sync($data['categories']);
        }

        return response()->json($post->load(['user', 'categories']));
    }
    
    public function destroy($id){
        $post = Post::findOrFail($id);
        
        // Elimina la imagen si existe
        if ($post->image_path && Storage::disk('public')->exists($post->image_path)) {
            Storage::disk('public')->delete($post->image_path);
        }
        
        $post->delete();

        return response()->json(['message' => 'Post eliminado correctamente']);
    }
}
