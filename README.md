# LMS Backend System

## Commandes NPM

### Développement
```bash
npm install          # Installer les dépendances
npm start            # Démarrer le serveur (mode production)
npm run dev          # Démarrer en mode développement (avec nodemon)
```

### Tests
```bash
npm test             # Exécuter tous les tests
npm run test:watch   # Exécuter les tests en mode watch
npm run test:cov     # Exécuter les tests avec couverture
npm run test:debug   # Exécuter les tests en mode debug
```

### Base de données
```bash
npm run db:migrate   # Exécuter les migrations
npm run db:reset     # Réinitialiser la base de données
npm run db:seed      # Peupler la base avec des données de test
```

### Linting & Formatage
```bash
npm run lint         # Vérifier le code avec ESLint
npm run format       # Formater le code avec Prettier
```

### CI/CD
```bash
npm run build        # Builder le projet
npm run ci           # Commande pour CI (test + build)
```

## Variables d'environnement
Créez un fichier `.env` basé sur `.env.example` avant de démarrer.
