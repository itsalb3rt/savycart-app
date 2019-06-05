<style>
    li{
        list-style-position: inside;
    }
    hr{
        border-color: grey;
        opacity: 0.3;
        width: 50%;
    }
</style>
<h1>Default index <?= $framework_name ?></h1>
<div>
    <div>
        <h2>Version: <?= $version ?></h2>
    </div>
    <hr>
    <div>
        <h4>Environment: <?= $environment ?></h4>
    </div>
    <div>
        <h5>Date: <?= $date ?></h5>
    </div>
    <div>
        <h5>External components included:</h5>
        <ul>
            <li><?= $external_components_included ?></li>
        </ul>
    </div>
    <hr>
    <div>
        <i>Autor: <?= $autor ?></i>
    </div>
</div>