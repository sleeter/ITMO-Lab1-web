<?php
session_start();

if (!isset($_SESSION["timbad"])){
    $_SESSION["timbad"] = array();
}

include "add_in_table.php";