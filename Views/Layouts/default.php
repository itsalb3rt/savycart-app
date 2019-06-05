<!doctype html>
<head>
    <meta charset="utf-8">
    <title><?= $page_title ?></title>
</head>
<body>
<div class="container" style="margin: auto;text-align:center;font-family: sans-serif;">

        <?=
        /**
         * Aqui se renderizan todas las vistas
         **/
        $content_for_layout;
        ?>
</div>
</body>
</html>
