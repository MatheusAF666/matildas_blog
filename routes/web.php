<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\AuthController; 
use App\Http\Controllers\PostController; 
use App\Http\Controllers\CategoryController; 
use App\Http\Controllers\Api\PostController as ApiPostController;
use App\Http\Controllers\Api\CategoryController as ApiCategoryController;

Route::prefix('api')->name('api.')->middleware('web')->group(function () {

    // --- RUTAS PÚBLICAS DE LA API ---
    Route::get('/posts', [ApiPostController::class, 'index'])->name('posts.index');
    Route::get('/posts/{slug}', [ApiPostController::class, 'show'])->name('posts.show');
    Route::get('/categories', [ApiCategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/{slug}', [ApiCategoryController::class, 'show'])->name('categories.show');

    // --- RUTAS DE AUTENTICACIÓN DE LA API ---
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/register', [AuthController::class, 'createUser'])->name('register');
    
    // --- RUTAS PROTEGIDAS DE LA API ---
    // Aquí usamos el middleware de Sanctum para proteger los endpoints.
    Route::middleware('auth:web')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/user', function (Request $request) {
            return $request->user();
        })->name('user');

        // CRUD de Posts (admin) - usando prefijo admin para evitar conflictos
        Route::get('/admin/posts', [PostController::class, 'index'])->name('admin.posts.index');
        Route::get('/admin/posts/{id}', [PostController::class, 'show'])->name('admin.posts.show')->where('id', '[0-9]+');
        Route::post('/admin/posts', [PostController::class, 'store'])->name('admin.posts.store');
        Route::put('/admin/posts/{id}', [PostController::class, 'update'])->name('admin.posts.update')->where('id', '[0-9]+');
        Route::delete('/admin/posts/{id}', [PostController::class, 'destroy'])->name('admin.posts.destroy')->where('id', '[0-9]+');
    });
});


// =========================================================================
// RUTA "CATCH-ALL" PARA LA SINGLE-PAGE APPLICATION (VUE)
// =========================================================================
// Esta debe ser la ÚLTIMA ruta del archivo.
// Carga la vista principal que monta Vue, permitiendo que Vue Router maneje el enrutamiento.

Route::get('/{any}', function () {
    return view('app'); // La vista que contiene <div id="app"></div>
})->where('any', '.*');