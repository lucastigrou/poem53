<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = trim($_POST["title"]);
    $poem = trim($_POST["poem"]);

    if (!empty($title) && !empty($poem)) {
        $file = "poems.txt";
        $date = date("Y-m-d H:i:s");
        $entry = "[$date] $title\n$poem\n\n";
        
        file_put_contents($file, $entry, FILE_APPEND);
        echo "Poème sauvegardé avec succès.";
    } else {
        echo "Erreur : Tous les champs doivent être remplis.";
    }
} else {
    echo "Méthode non autorisée.";
}
?>
