<?php

return [

    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Most templating systems load templates from disk. Here you may specify
    | an array of paths that should be checked for your views. Of course
    | the usual Laravel 'resources/views' path has already been included
    | in for you as protection against accidentally clobbering your own
    | views files. But, feel free to tweak this list as needed.
    |
    */

    'paths' => [
        resource_path('views'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Compiled View Path
    |--------------------------------------------------------------------------
    |
    | This option determines where all the compiled Blade templates will be
    | stored for your application. Typically, this is within the storage
    | directory. However, as usual, you are free to change this value.
    |
    */

    'compiled' => rtrim(env('VIEW_COMPILED_PATH', storage_path('framework/views')), '/'),

    /*
    |--------------------------------------------------------------------------
    | Relative Hash
    |--------------------------------------------------------------------------
    |
    | When enabled, the compiled view path will use a relative hash appended
    | to the path to bust view caches when the base path of the application
    | changes. This is useful for deployments without requiring cache busts.
    |
    */

    'relative_hash' => false,

    /*
    |--------------------------------------------------------------------------
    | View Caching
    |--------------------------------------------------------------------------
    |
    | This option allows you to control whether view caching is enabled. Some
    | applications may want to disable view caching in development in order
    | to see changes made to views files immediately when they are edited.
    |
    */

    'cache' => true,

];
