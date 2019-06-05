<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="<?= Assets::setAssets('css/ligne/ligne.css') ?>">
    <title><?=$page_title?></title>
</head>
<body>
<?=
/**
 * Aqui se renderizan todas las vistas
 **/
$content_for_layout;
?>
</body>
</html>