// Fonction utilitaire pour afficher un message d'alerte contextuel
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000); // Disparaît après 3 secondes
}
function savePoem() {
    let title = document.getElementById("poemTitle").value.trim();
    let poem = document.getElementById("poemText").value.trim();

    if (title === "" || poem === "") {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "save_poem.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert("Poème sauvegardé !");
            addPoemToPage(title, poem);
            closeModal();
            document.getElementById("poemTitle").value = "";
            document.getElementById("poemText").value = "";
        }
    };
    xhr.send("title=" + encodeURIComponent(title) + "&poem=" + encodeURIComponent(poem));
}

function addPoemToPage(title, poem) {
    const poemCount = document.querySelectorAll('.poem').length + 1;
    const newPoemId = `poem${poemCount}`;

    const poemList = document.getElementById('poemList');
    const main = document.querySelector('main');

    const newButton = document.createElement('button');
    newButton.className = 'poem-button';
    newButton.textContent = title;
    newButton.setAttribute('onclick', `scrollToPoem('${newPoemId}')`);
    poemList.appendChild(newButton);

    const newSection = document.createElement('section');
    newSection.id = newPoemId;
    newSection.className = 'poem fade-in';
    newSection.innerHTML = `
        <h2>${title}</h2>
        <p>${poem.replace(/\n/g, "<br>")}</p>
        <button class="delete-button" onclick="deletePoem('${newPoemId}')">Supprimer</button>
    `;

    main.appendChild(newSection);
}


// Fonction de filtrage des poèmes en fonction de la recherche
function searchPoem() {
    const query = document.getElementById('search').value.toLowerCase().trim();
    const buttons = document.querySelectorAll('.poem-button');

    let found = false;

    buttons.forEach(button => {
        const poemName = button.textContent.toLowerCase();
        if (poemName.includes(query)) {
            button.style.display = 'block';
            found = true;
        } else {
            button.style.display = 'none';
        }
    });

    if (!found) {
        showAlert("Aucun poème trouvé.", "warning");
    }
}

// Fonction pour défiler vers un poème spécifique
function scrollToPoem(poemId) {
    const poemElement = document.getElementById(poemId);
    if (poemElement) {
        poemElement.scrollIntoView({ behavior: "smooth" });
        poemElement.classList.add('highlight');
        setTimeout(() => poemElement.classList.remove('highlight'), 2000); // Retire l'effet après 2 secondes
    } else {
        showAlert("Poème introuvable.", "error");
    }
}

// Connexion en tant qu'élève
function loginAsEleve() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
    showAlert("Bienvenue Élève !", "success");
}

// Afficher la connexion pour les professeurs
function showProfLogin() {
    document.getElementById('profLogin').style.display = 'block';
}

// Fonction pour synchroniser les titres des poèmes avec la barre latérale
function syncPoemTitles() {
    const poems = document.querySelectorAll('.poem');
    const poemList = document.getElementById('poemList');

    poemList.innerHTML = ''; // Réinitialise la liste

    poems.forEach(poem => {
        const title = poem.querySelector('h2').textContent.trim();
        const poemId = poem.id;

        const button = document.createElement('button');
        button.className = 'poem-button';
        button.textContent = title || "Titre manquant";
        button.setAttribute('onclick', `scrollToPoem('${poemId}')`);
        poemList.appendChild(button);
    });
}

// Supprimer un poème avec confirmation
function deletePoem(poemId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce poème ?")) {
        const poem = document.getElementById(poemId);
        poem.remove();

        const poemButton = document.querySelector(`.poem-button[onclick="scrollToPoem('${poemId}')"]`);
        if (poemButton) {
            poemButton.remove();
        }

        showAlert("Poème supprimé avec succès.", "success");
    }
}

// Ajouter un nouveau poème
function addPoem() {
    const poemCount = document.querySelectorAll('.poem').length;
    const newPoemId = `poem${poemCount + 1}`;

    const title = prompt("Entrez le titre du poème :", `Poème ${poemCount + 1}`);
    if (!title || title.trim() === "") {
        showAlert("Le titre ne peut pas être vide.", "error");
        return;
    }

    const author = prompt("Entrez l'auteur du poème :", "Auteur inconnu");

    const poemList = document.getElementById('poemList');
    const main = document.querySelector('main');

    const newButton = document.createElement('button');
    newButton.className = 'poem-button';
    newButton.textContent = title;
    newButton.setAttribute('onclick', `scrollToPoem('${newPoemId}')`);
    poemList.appendChild(newButton);

    const newSection = document.createElement('section');
    newSection.id = newPoemId;
    newSection.className = 'poem';
    newSection.contentEditable = 'true';
    newSection.innerHTML = `
        <h2 contenteditable="true">${title}</h2>
        <p>Ajoutez votre texte ici...</p>
        <p>- ${author}</p>
        <button class="delete-button" onclick="deletePoem('${newPoemId}')">Supprimer</button>
    `;
    main.appendChild(newSection);

    showAlert("Poème ajouté avec succès.", "success");
    syncPoemTitles(); // Synchroniser après l'ajout
}

// Connexion en tant que professeur
function loginAsProf() {
    const password = document.getElementById('password').value.trim();
    if (password === 'Khenissi12345') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
        enableEditing();
        document.getElementById('addPoemButton').style.display = 'block';

        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.style.display = 'block';
        });

        showAlert("Bienvenue Professeur !", "success");
        syncPoemTitles(); // Synchroniser les titres à la connexio
    } else {
        showAlert('Mot de passe incorrect', 'error');
    }
}

// Activer la modification pour les professeurs
function enableEditing() {
    const poems = document.querySelectorAll('.poem');
    poems.forEach(poem => {
        poem.setAttribute('contenteditable', 'true');
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    syncPoemTitles(); // Synchroniser les titres dès le chargement
});
// Fonction utilitaire pour afficher des messages contextuels
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Recherche avancée : par auteur ou contenu
function advancedSearchPoem() {
    const query = document.getElementById('search').value.toLowerCase().trim();
    const poems = document.querySelectorAll('.poem');
    let found = false;

    poems.forEach(poem => {
        const content = poem.textContent.toLowerCase();
        if (content.includes(query)) {
            poem.style.display = 'block';
            found = true;
        } else {
            poem.style.display = 'none';
        }
    });

    if (!found) {
        showAlert("Aucun résultat trouvé.", "warning");
    }
}



