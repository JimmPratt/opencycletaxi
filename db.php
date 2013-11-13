<?php
require_once 'meekrodb.2.2.class.php';
DB::$user = 'opencycletaxi';
DB::$password = 'Meoadeo345!';
DB::$dbName = 'opencycletaxi';

$results = DB::query("SELECT type, name, mobile_number, email, X(geom) AS x, Y(geom) AS y, status FROM user WHERE type = 'driver'");
foreach ($results as $row) {
  echo "type: " . $row['type'] . ", ";
  echo "name: " . $row['name'] . ", ";
  echo "mobile: " . $row['mobile_number'] . ", ";
  echo "email: " . $row['email'] . ", ";
  echo "location: (" . $row['x'] . ", " . $row['y'] . "), ";
  echo "status: " . $row['status'] . " ";
  echo "<br>";
}

?>