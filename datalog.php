<?php
header('Content-Type: application/json');

$serverName = "namtung.database.windows.net";
$connectionOptions = array(
    "Database" => "namtung",
    "Uid" => "namtung",
    "PWD" => "Aimabiet999"
);

$conn = sqlsrv_connect($serverName, $connectionOptions);
$tsql= "SELECT times, temperature,humidity FROM testing";
$getResults= sqlsrv_query($conn, $tsql);

$outp = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
  $outp[]= $row;
}
// $outp ='['.$outp.']';
print json_encode($outp);
sqlsrv_free_stmt($getResults);

?>
