<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $poem = trim($_POST["poem"]);

    if (!empty($poem)) {
        $file = "poems.txt";
        $date = date("Y-m-d H:i:s");
        $entry = "[$date] " . $poem . "\n\n";
        
        file_put_contents($file, $entry, FILE_APPEND);
        echo "Poème sauvegardé avec succès.";
    } else {
        echo "Erreur : Le poème est vide.";
    }
} else {
    echo "Méthode non autorisée.";
}
?>
