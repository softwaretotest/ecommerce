<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->in(__DIR__);

$config = new Config();
return $config->setRules([
    '@PSR12' => true,
    'no_unused_imports' => true,
    'ordered_imports' => ['sort_algorithm' => 'alpha'],
])
    ->setFinder($finder);
