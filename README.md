# my-redwood-app

> Recherche de profils LinkedIn via Google X-Ray • RedwoodJS • Serper.dev

## Présentation

my-redwood-app est une application full-stack construite avec RedwoodJS permettant de rechercher des profils LinkedIn par mots-clés. Les résultats sont stockés en base de données et affichés avec un scroll infini.

- Inscription et connexion sécurisée (dbAuth RedwoodJS)
- Recherche de profils LinkedIn par mots-clés et localisation
- Scroll infini avec scraping automatique via Serper.dev
- Historique des recherches par utilisateur

## Stack technique

- **RedwoodJS** — framework full-stack
- **React** — frontend
- **GraphQL (Apollo Server)** — API
- **Prisma + SQLite** — ORM et base de données
- **Serper.dev** — scraping Google X-Ray
- **Faker.js** — données de seed

## Prérequis

- Node.js >= 18
- Yarn
- Un compte Serper.dev (gratuit, 2 500 requêtes offertes)

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/votre-repo/my-redwood-app.git
cd my-redwood-app
```

### 2. Installer les dépendances
```bash
yarn install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet et remplir les valeurs (voir section suivante).

### 4. Initialiser la base de données
```bash
yarn rw prisma migrate dev
```

### 5. Lancer le seed
```bash
yarn rw prisma db seed
```

Crée 1 utilisateur de test, 5 utilisateurs fictifs, 100 recherches et plus de 1 000 profils.

### 6. Démarrer l'application
```bash
yarn rw dev
```

Application accessible sur http://localhost:8910

## Variables d'environnement

| Variable | Exemple | Description |
|---|---|---|
| `SESSION_SECRET` | `chaine_aléatoire_32+` | Secret sessions dbAuth |
| `SERPER_API_KEY` | `votre_clé_api` | Clé API Serper.dev |

Pour générer un `SESSION_SECRET` sécurisé :
```bash
yarn rw generate secret
```

Pour obtenir une clé API Serper.dev :

1. S'inscrire sur [serper.dev](https://serper.dev) (gratuit, sans CB)
2. Copier la clé depuis le dashboard

## Compte de test

- **Email :** test@test.com
- **Mot de passe :** password123

Ce compte est créé automatiquement par le seed avec des recherches et profils déjà en base.

## Commandes utiles
```bash
yarn rw dev                           # Démarrer l'app
yarn rw prisma studio                 # Interface graphique DB
yarn rw prisma db seed                # Relancer le seed
yarn rw prisma migrate dev --name nom # Créer une migration
yarn rw generate secret               # Générer un SESSION_SECRET
npx kill-port 8910 8911               # Libérer les ports
```
