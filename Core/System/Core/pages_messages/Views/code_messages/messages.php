<html>
<head>
    <meta charset="UTF-8">
    <title>Oopss</title>
    <style>
        * {
            font-family: sans-serif;
        }

        body {
            background: #EEEEEE;
            font-family: 'Lato', serif;
            margin: 0;
            padding: 0;
        }

        .page-wrap {
            margin: 0 auto;
            width: 100%;
            text-align: center;
        }

        p, a {
            font-size: 1em;
        }

        h2, a {
            text-transform: uppercase;
        }

        a {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            width: 88px;
            height: 44px;
            line-height: 44px;
            border-radius: 5px;
            border: 2px solid #fff;
            transition: all .5s ease;
        }

        a:hover {
            background: #64B5F6;
            border: 2px solid #64B5F6;
            width: 132px;
        }

        /* MEDIA QUERIES
        ================================================== */

        /* smartphones, portrait iPhone, portrait 480x320 phones (Android) */
        @media (min-width: 320px) {
            h1 {
                font-size: 2em;
            }

            h2 {
                font-size: 1.5em;
            }
        }


        /* smartphones, Android phones, landscape iPhone */
        @media (min-width: 480px) {
            h1 {
                font-size: 3em;
            }

            h2 {
                font-size: 1.75em;
            }
        }

        /* portrait tablets, portrait iPad, e-readers (Nook/Kindle), landscape 800x480 phones (Android) */
        @media (min-width: 600px) {
            h1 {
                font-size: 4em;
            }

            h2 {
                font-size: 2em;
            }
        }

        /* tablet, landscape iPad, lo-res laptops ands desktops */
        @media (min-width: 801px) {
            h1 {
                font-size: 5em;
            }

            h2 {
                font-size: 3em;
            }
        }

        /* big landscape tablets, laptops, and desktops */
        @media (min-width: 1025px) {
            h1 {
                font-size: 6em;
            }

            h2 {
                font-size: 4em;
            }
        }

        /* hi-res laptops and desktops */
        @media (min-width: 1281px) {
            h1 {
                font-size: 7em;
            }

            h2 {
                font-size: 5em;
            }
        }

        div.header {
            margin: auto auto 1px auto;
            background-color: #f44336;
            height: auto;
            font-weight: bold;
            color: white;
            text-align: left;
            font-size: 38px;
        }

        div.header .header_text {
            background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjEuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMS45OTkgNTExLjk5OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTExLjk5OSA1MTEuOTk5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggc3R5bGU9ImZpbGw6IzVENTM2MDsiIGQ9Ik0yMzYuMzk1LDQyLjYxM0wzLjA2Nyw0NDYuNzQ5Yy04LjcxMywxNS4wOTIsMi4xNzgsMzMuOTU3LDE5LjYwNSwzMy45NTdoNDY2LjY1NiAgYzE3LjQyNywwLDI4LjMxOC0xOC44NjUsMTkuNjA1LTMzLjk1N0wyNzUuNjA1LDQyLjYxM0MyNjYuODkyLDI3LjUyMSwyNDUuMTA4LDI3LjUyMSwyMzYuMzk1LDQyLjYxM3oiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTE3RDsiIGQ9Ik0yNDguODQ4LDEwMy42MjNMNjIuMTMxLDQyNy4wMjljLTMuMTc5LDUuNTA1LDAuNzk1LDEyLjM4Nyw3LjE1MiwxMi4zODdoMzczLjQzNSAgYzYuMzU3LDAsMTAuMzMtNi44ODIsNy4xNTItMTIuMzg3TDI2My4xNTIsMTAzLjYyM0MyNTkuOTczLDk4LjExOCwyNTIuMDI3LDk4LjExOCwyNDguODQ4LDEwMy42MjN6Ii8+CjxnPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojNUQ1MzYwOyIgY3g9IjI1NiIgY3k9IjM2OS44NyIgcj0iMTYuNTE2Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNUQ1MzYwOyIgZD0iTTI2NS40MDgsMzEzLjQyNmwxMy43NjMtODIuNTgxYzAuODM5LTUuMDM0LTMuMDQzLTkuNjE2LTguMTQ2LTkuNjE2aC0zMC4wNTIgICBjLTUuMTAzLDAtOC45ODUsNC41ODItOC4xNDYsOS42MTZsMTMuNzYzLDgyLjU4MWMwLjY2NCwzLjk4Miw0LjEwOSw2LjksOC4xNDYsNi45aDIuNTI1ICAgQzI2MS4yOTksMzIwLjMyNiwyNjQuNzQ1LDMxNy40MDcsMjY1LjQwOCwzMTMuNDI2eiIvPgo8L2c+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6IzRCM0Y0RTsiIGQ9Ik0zNy45NzEsNDI0Ljg5MkwyNjQuMzY2LDMyLjg2OWMtOS44MjktMy44MTUtMjIuMDA2LTAuNTg5LTI3Ljk3MSw5Ljc0M0wzLjA2Nyw0NDYuNzQ5ICAgYy04LjcxMywxNS4wOTIsMi4xNzgsMzMuOTU3LDE5LjYwNSwzMy45NTdoNDY2LjY1N2MxMS42ODMsMCwyMC40MzMtOC41MTYsMjIuMzAzLTE4LjY1Mkg1OS40MjYgICBDNDAuMzU1LDQ2Mi4wNTQsMjguNDM2LDQ0MS40MDksMzcuOTcxLDQyNC44OTJ6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNEIzRjRFOyIgZD0iTTI1NiwyMjEuMjI5aC0xNS4wMjZjLTUuMTAzLDAtOC45ODUsNC41ODItOC4xNDYsOS42MTVsMTMuNzYzLDgyLjU4MSAgIGMwLjY2NCwzLjk4Miw0LjEwOSw2LjkwMSw4LjE0Niw2LjkwMUgyNTZWMjIxLjIyOXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM0QjNGNEU7IiBkPSJNMjY0LjI1OCwzNzguMTMyYy05LjEyMSwwLTE2LjUxNi03LjM5NS0xNi41MTYtMTYuNTE2YzAtMi40MiwwLjUyNC00LjcyNywxLjQ2LTYuNzk4ICAgYy01LjczNSwyLjU5LTkuNzE4LDguMzU1LTkuNzE4LDE1LjA1NmMwLDkuMTIxLDcuMzk1LDE2LjUxNiwxNi41MTYsMTYuNTE2YzYuNzAxLDAsMTIuNDY2LTMuOTg0LDE1LjA1Ni05LjcxOSAgIEMyNjguOTg1LDM3Ny42MDcsMjY2LjY3OCwzNzguMTMyLDI2NC4yNTgsMzc4LjEzMnoiLz4KPC9nPgo8cGF0aCBzdHlsZT0iZmlsbDojRkZEMTY0OyIgZD0iTTQ0Ni4yNTMsNDIwLjc2M0gxOTEuMzRjLTQ0LjQ5OSwwLTcyLjMxMS00OC4xNzItNTAuMDYyLTg2LjcxbDEyNy40NTYtMjIwLjc2MWwtNS41ODMtOS42NjkgIGMtMy4xNzgtNS41MDYtMTEuMTI1LTUuNTA2LTE0LjMwMywwTDYyLjEzMSw0MjcuMDI5Yy0zLjE3OCw1LjUwNSwwLjc5NCwxMi4zODcsNy4xNTIsMTIuMzg3aDM3My40MzUgIGM2LjM1NywwLDEwLjMzLTYuODgyLDcuMTUyLTEyLjM4N0w0NDYuMjUzLDQyMC43NjN6Ii8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=);
            background-repeat: no-repeat;
            background-position-x: right;
            background-position-y: center;
            background-origin: content-box;
            -webkit-background-size: 64px;
            background-size: 64px;
            min-height: 64px;
            min-width: 64px;
        }

        div.description {
            width: 80%;
            border: 4px solid rgba(31, 99, 172, 0.35);
            margin: auto;
            min-height: 500px;
            padding: 6px;
            text-align: left;
            background-color: white;
            border-radius: 0 0 10px 10px;
            box-shadow: 4px 4px 6px -2px rgba(128, 128, 128, 0.45);
        }

        div.description .text {
            color: #000;
            background-color: #03A9F4;
            width: 70%;
            margin-top: 20px;
            padding: 15px;
            border-radius: 4px;
            color: white;
        }

        /*Paneles o contenedores*/

        .panel {
            margin-bottom: 20px;
            background-color: #fff;
            border: 1px solid transparent;
            border-radius: 4px;
        }

        .panel.bordered {
            border-color: #ddd;
            -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
            box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
        }

        .panel > .head {
            color: #333;
            background-color: #f5f5f5;
            border-color: #ddd;
        }

        .panel > .head {
            padding: 10px 15px;
            border-bottom: 1px solid transparent;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }

        .panel .body {
            padding: 15px;
            min-height: 400px;
        }

        .panel .body label {
            font-weight: bold;
        }

        .panel.small {
            max-width: 40%;
        }

        .panel.medium {
            max-width: 60%;
        }

        .panel .head.primary {
            color: #fff;
            background-color: #03A9F4;
            border-color: #03A9F4;
        }

        .panel .head.danger {
            color: #fff;
            background-color: #d32f2f;
            border-color: #d32f2f;
        }

        .panel .head.success {
            color: #fff;
            background-color: #4CAF50;
            border-color: #4CAF50;
        }

        /*flexboxgrid*/
        .container-fluid,
        .container {
            margin-right: auto;
            margin-left: auto;
        }

        .container-fluid {
            padding-right: 2rem;
            padding-left: 2rem;
        }
        /*Estilo de codigo*/
        .code,.special_name_element {
            padding: .2rem .5rem;
            margin: 0 .2rem;
            font-size: 85%;
            white-space: nowrap;
            background: rgb(241, 241, 241);
            border: 1px solid rgb(225, 225, 225);
            border-radius: 4px;
        }
        ul li {
            margin: 8px auto;
        }
        .debug_backtrace div{
            margin: 10px;
        }
        @media only screen and (min-width: 48em) {
            .container {
                width: 49rem;
            }

            @media only screen and (min-width: 64em) {
                .container {
                    width: 65rem;
                }

                @media only screen and (min-width: 75em) {
                    .container {
                        width: 76rem;
                    }

    </style>
</head>
<bory>
    <!-- hack -->
    <div class="panel"style="background-color: #f44336">
        <div class="header"></div>
    </div>

    <div class="container-fluid">
        <div class="panel header">
            <div class=" body header_text">
                <?= $header ?>
            </div>
        </div>
        <div class="panel bordered">
            <div class="body">
                <?= $description ?>
                <div>
                    <?php if ($route != null): ?>
                        <div class="text route">
                            <h3>Route:</h3>
                            <?= $route; ?>
                        </div>
                    <?php endif; ?>
                </div>
                <br>
                <div class="code debug_backtrace">
                    <?php
                    $e = new \Exception;
                    $data = explode('#',$e);
                    $route = str_replace(DS ,'\\',ROOT);
                    foreach($data as $key => $val){
                        if($key > 0 ){
                            echo '<div>'. str_replace($route,'',$data[$key]) . '</div>';
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
</bory>
</html>