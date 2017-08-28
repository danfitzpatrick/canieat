<?php
$servername = "mysql.canieat.danfitzpatrick.net";
$username = "canieat";
$password = "e-eats-everything";
$dbname = "canieat";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// sql to create table
$sql = "CREATE TABLE canieat_log (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
cal_eaten INT(6) NOT NULL,
cal_burned INT(6) NOT NULL,
curr_deficit INT(6) NOT NULL,
proj_burn INT(6) NOT NULL,
proj_burn_2 INT(6) NOT NULL,
proj_def INT(6) NOT NULL,
proj_def_2 INT(6) NOT NULL,
time_logged TIMESTAMP
)";

if (mysqli_query($conn, $sql)) {
    echo "Table canieat_log created successfully";
} else {
    echo "Error creating table: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
