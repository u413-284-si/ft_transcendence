import { TranslationShape } from "./en.js";
const fr: TranslationShape = {
  translation: {
    error: {
      invalidDynamicRoutePattern:
        "Modèle de route dynamique invalide : {{pattern}}",
      matchNotFound: "Match non trouvé.",
      missingRequestID: "L’ID de la demande est manquant.",
      nextMatchNotFound: "Prochain match non trouvé.",
      noActiveToken: "Aucun jeton actif trouvé.",
      nullMatches: "Il n’y a pas de matchs.",
      requestNotFound: "Demande avec l’ID {{id}} non trouvée.",
      somethingWentWrong: "Une erreur s’est produite.",
      tournamentIDNotFound: "ID de tournoi non trouvé.",
      undefinedMatch: "Le match est indéfini",
      unexpected: "Une erreur inattendue s’est produite.",
      unknownRequestListType: "Type de liste de demandes inconnu : {{type}}",
      userNotFound: "Utilisateur non trouvé.",
      userStatsNotFound: "Statistiques de l’utilisateur non trouvées.",
      validateUser:
        "Une erreur s’est produite lors de la validation de l’utilisateur :<br>Redirection vers la page de connexion."
    },
    errorView: {
      details: "Détails : {{cause}}",
      errorStatus: "⚠️ Erreur {{status}}",
      title: "Erreur",
      reload: "Recharger"
    },
    friendListItem: {
      accept: "Confirmer",
      decline: "Refuser",
      delete: "Effacer",
      pending: "En attente",
      remove: "Enlever"
    },
    friendsView: {
      addFriend: "Ajouter un ami",
      confirmDeclineRequest: "Êtes-vous sûr de vouloir refuser cette demande ?",
      confirmDeleteRequest:
        "Êtes-vous sûr de vouloir supprimer cette demande ?",
      confirmRemoveFriend: "Êtes-vous sûr de vouloir supprimer cet ami ?",
      exactUsername: "Nom d’utilisateur exact",
      friendRequests: "Demandes d’amis",
      title: "Amis",
      incomingRequests: "Demandes d’amis entrantes",
      noFriends: "Vous n’avez pas encore d’amis",
      noIncoming: "Aucune demande d’ami entrante",
      noOutgoing: "Aucune demande d’ami sortante",
      outgoingRequests: "Demandes d’amis sortantes",
      sendFriendRequest: "Envoyer une demande d’ami",
      yourFriends: "Vos amis"
    },
    gameView: {
      title: "En cours"
    },
    global: {
      avatar: "Avatar",
      submit: "Valider",
      confirmNewPassword: "Confirmez le nouveau mot de passe",
      continue: "Appuyez sur la touche ENTER pour continuer",
      editProfile: "Modifier votre profil",
      email: "Adresse e‑mail",
      label: "{{field}} :",
      logout: "Déconnexion",
      lost: "Perdu",
      match: "Match {{matchId}}",
      offline: "Hors ligne",
      online: "En ligne",
      password: "Mot de passe",
      twoFACode: "Code 2FA",
      pongGame: "Jeu de pong",
      player: "Joueur",
      playerWins: "{{player}} a gagné",
      round: "Manche {{round}}",
      toBeDefined: "À définir",
      tournament: "Tournoi : <strong>{{tournamentName}}</strong>",
      username: "Nom d’utilisateur",
      userNotFound: "Utilisateur non trouvé.",
      welcome: "Bienvenue",
      winnerMatch: "Match gagnant {{matchId}}",
      won: "Gagné"
    },

    homeView: {
      helloUser: "Bonjour {{username}}!",
      tagline: "Enter the Grid. Master the Pong.",
      title: "Accueil",

      faqTitle: "FAQ",
      faqGameModesTitle: "Modes de jeu",
      faqGameModesSingle:
        "Partie simple : un match rapide contre l'IA ou un ami.",
      faqGameModesTournament:
        "Tournoi : affrontez plusieurs manches jusqu'à ce qu'il ne reste qu'un champion.",

      faqControlsTitle: "Contrôles",
      faqControlsRightPaddle: "Déplacer la raquette droite : Flèches ↑ ↓ ",
      faqControlsLeftPaddle: "Déplacer la raquette gauche : W / S",

      faqTipsTitle: "Conseils",
      faqTips1: "Anticipez le trajet de la balle au lieu de courir après.",
      faqTips2:
        "Utilisez les bords de la raquette pour changer l'angle de la balle.",
      faqTips3:
        "Attention ! Chaque coup de raquette augmente la vitesse de la balle.",

      faqExtrasTitle: "Infos complémentaires",
      faqExtrasText:
        "Pong est l'un des premiers jeux vidéo jamais créés : simple, intemporel et addictif. Inspiré par TRON, cette version réinvente le classique dans un style néon."
    },

    invalid: {
      emailEmpty: "L’adresse e‑mail ne peut pas être vide.",
      emailFormat:
        "L’adresse e‑mail doit être au format d’une adresse e‑mail valide.",
      emailOrUsernameEmpty:
        "Veuillez saisir un nom d’utilisateur ou une adresse e‑mail.",
      emailOrUsernameFormat:
        "Le nom d’utilisateur ou l’adresse e‑mail doit être valide.",
      fillAtLeastOneField: "Veuillez remplir au moins un champ.",
      fillInUsername: "Veuillez donner un nom d’utilisateur.",
      friendNotSelf: "Vous ne pouvez pas vous ajouter en ami.",
      friendRequestAlreadySent: "Vous avez déjà envoyé une demande d'ami.",
      friendsAlready: "Vous êtes déjà amis.",
      imageFileEmpty: "Veuillez sélectionner un fichier à télécharger.",
      imageFileFormat: "Veuillez télécharger un fichier image valide.",
      nicknameEmpty: "Le pseudonyme ne peut pas être vide.",
      nicknameFormat:
        "Le pseudonyme doit être composé de 3 à 20 caractères et peut comprendre des lettres, des chiffres ou les caractères spéciaux suivants : -!?_$.",
      nicknameUniqueness: "Le pseudonyme doit être unique.",

      passwordEmpty: "Le mot de passe ne peut pas être vide.",
      passwordFormat:
        "Le mot de passe doit être composé de 10 à 64 caractères et contenir au moins un chiffre, une lettre majuscule et une lettre minuscule, ainsi que l’un des caractères spéciaux suivants : @$!%*?&",
      passwordConfirmationEmpty:
        "Veuillez saisir à nouveau votre mot de passe.",
      passwordConfirmation:
        "La confirmation du mot de passe ne correspond pas au mot de passe saisi.",
      twoFACode: "Le code 2FA est invalide.",
      twoFACodeEmpty: "Le code 2FA ne peut pas être vide.",
      twoFACodeFormat: "Le code 2FA doit contenir six chiffres.",
      twoFABackupCode: "Le code de secours est invalide.",
      twoFABackupCodeEmpty: "Le code de secours ne peut pas être vide.",
      twoFABackupCodeFormat: "Le code de secours doit contenir huit chiffres.",
      playerSelection: "Veuillez sélectionner le nombre de joueurs.",
      tournamentNameEmpty: "Le nom du tournoi ne peut pas être vide.",
      tournamentNameFormat:
        "Le nom du tournoi doit être composé de 3 à 20 caractères et ne peut contenir que des lettres, des chiffres ou les caractères spéciaux suivants : -!?_$.",
      tournamentNameUniqueness: "Le nom du tournoi doit être unique.",
      usernameEmpty: "Le nom d’utilisateur ne peut pas être vide.",
      usernameFormat:
        "Le nom d’utilisateur doit être composé de 3 à 20 caractères et peut comprendre des lettres, des chiffres ou les caractères spéciaux suivants : -!?_$.",
      usernameUniqueness: "Le nom d’utilisateur doit être unique."
    },
    loginView: {
      title: "Connexion",
      usernameOrEmail: "Nom ou adresse mail"
    },
    twoFAVerifyView: {
      title: "Vérification du code 2FA",
      enterTwoFACode: "Entrez votre code 2FA :",
      useBackupCode: "Utiliser le code de secours"
    },
    twoFABackupCodeVerifyView: {
      title: "Vérification du code de secours",
      twoFABackupCode: "Code de secours",
      enterTwoFABackupCode: "Entrez votre code de secours :"
    },
    matchAnnouncementView: {
      abortTournament: "Annuler le tournoi",
      nextMatch: "Prochain match à jouer",
      title: "Prochain match !",
      roundMatch: "Manche {{round}} - Match {{match}}",
      startMatch: "Démarrer le match",
      skipMatch: "Sauter le match",
      spectateMatch: "Observer le match"
    },
    newGameView: {
      title: "Nouveau jeu",
      enterNickname: "Entrez un pseudonyme pour chaque joueur.",
      selectPlayer: "Sélectionnez quel joueur sera contrôlé par {{username}}.",
      aiOption: "Optionnel : activez l'IA pour contrôler l'autre joueur.",
      startGame: "Démarrer le jeu"
    },
    newTournamentView: {
      confirmAbortTournament: "Voulez-vous vraiment annuler le tournoi ?",
      enterTournamentName: "Entrez le nom du tournoi",
      selectNumberPlayers: "Sélectionnez le nombre de joueurs",
      title: "Nouveau tournoi",
      numberOfPlayers: "Nombre de joueurs",
      players4: "4 joueurs",
      players8: "8 joueurs",
      players16: "16 joueurs",
      startTournament: "Démarrer le tournoi",
      tournamentName: "Nom du tournoi"
    },
    nicknameInput: {
      enterYourNickname: "Entrez votre pseudonyme",
      playerChoice: "{{username}} joue en tant que joueur {{i}}",
      playerNickname: "Pseudonyme du joueur {{i}}",
      aiPlayer: "Joueur IA",
      aiStrength: "Difficulté de l'IA",
      aiStrengthEasy: "Facile",
      aiStrengthMedium: "Moyenne",
      aiStrengthHard: "Difficile"
    },
    playerNicknamesView: {
      enterPlayerNicknames: "Entrez les pseudonymes des joueurs",
      title: "Pseudonymes des joueurs",
      aiOptions:
        "Optionnel : activez l'IA pour contrôler un ou plusieurs d'autres joueurs.",
      submitNicknames: "Valider les pseudonymes"
    },
    profileView: {
      cannotChangeEmailOrPW:
        "Vous ne pouvez pas changer votre adresse e-mail ou votre mot de passe.",
      changeAvatar: "Modifiez votre avatar.",
      changePasswordButton: "Modifier le mot de passe",
      changePassword: "Modifiez votre mot de passe.",
      chooseFile: "Choisissez un fichier image",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      noFileSelected: "Aucun fichier sélectionné",
      saveChanges: "Enregistrer",
      signedInWithGoogle: "Connecté avec Google",
      updateProfile: "Mettez à jour votre profil.",
      uploadYourAvatar: "Téléchargez votre avatar",
      title: "Votre profil"
    },
    registerView: {
      register: "Inscrivez-vous",
      title: "S'inscrire"
    },
    resultsView: {
      bracket: "Arbre du tournoi",
      champion: "Champion",
      congratulations: "Félicitations pour la victoire !",
      finish: "Marquer comme terminé",
      title: "Résultats",
      tournamentResults: "Résultats du tournoi"
    },
    settingsView: {
      title: "Paramètres",
      settings: "Configurez vos préférences et paramètres ici.",
      preferredLanguage: "Choisissez votre langue préférée.",
      saveLanguage: "Enregistrer la langue",
      displayTwoFASetup:
        "Afficher la configuration de l’authentification à deux facteurs",
      deactivateTwoFASetup: "Désactiver l’authentification à deux facteurs",
      editTwoFASetup:
        "Modifier la configuration de l’authentification à deux facteurs",
      twoFASetup: "Paramètres de l’authentification à deux facteurs",
      twoFAInfo: [
        "Activer l’authentification à deux facteurs :",
        "",
        "Veuillez utiliser une application d’authentification",
        "pour scanner le code QR ci-dessous."
      ],
      twoFAActivated: ["L’authentification à deux facteurs est activée"],
      twoFABackupCode: "Codes de secours",
      enterTwoFACode: "Entrez votre code 2FA :",
      activateTwoFA: "Activer",
      deactivateTwoFA: "Désactiver",
      twoFAGenerateBackupCodes: "Générer des codes de secours",
      confirmPassword: "Confirmation",
      twoFABackupCodeInfo: [
        "Voici vos codes de secours.",
        "Copiez-les ou téléchargez-les.",
        "",
        "Ils ne seront plus affichés par la suite."
      ],
      twoFADownloadBackupCodes: "Télécharger les codes"
    },
    statsView: {
      dashboard: "Tableau",
      date: "Date",
      details: "Détails",
      eliminatedInRound: "Éliminé au tour {{round}}",
      friendOnly:
        "Vous devez être amis avec ce joueur pour voir les statistiques détaillées.",
      friends: "Amis",
      joined: "Inscrit le {{date}}",
      matches: "Matchs",
      matchHistory: "Historique des matchs",
      played: "Joué",
      player1: "Joueur 1",
      player2: "Joueur 2",
      player1Score: "Score du joueur 1",
      player2Score: "Score du joueur 2",
      result: "Résultat",
      title: "Statistiques",
      tournament: "Tournoi",
      tournaments: "Tournois",
      usedNickname: "Pseudonyme utilisé",
      winRate: "Taux de victoire",
      winstreakCur: "Série de victoires",
      winstreakMax: "Max-Série"
    },
    toast: {
      acceptedFriendRequest: "Demande d’ami acceptée par ",
      avatarUploadFailed:
        "Échec du téléchargement de l’avatar. Veuillez réessayer.",
      avatarUploadedSuccess: "Avatar téléchargé avec succès !",
      chartCannotRemoveYourself: "Vous ne pouvez pas vous supprimer.",
      chartCompareMaxThree: "Vous pouvez comparer un maximum de 3 amis.",
      chartError: "Un diagramme n'a pas pu être initialisé",
      connectionUnavailable:
        "Impossible de se reconnecter. Tentatives arrêtées jusqu’à l’actualisation.",
      connectionLost:
        "Connexion perdue – nouvelle tentative dans {{delay}} secondes… (Tentative {{attempt}} sur {{maxAttempts}})",
      connectionReestablished: "Connexion rétablie",
      declinedFriendRequest: "Demande d’ami refusée par ",
      deletedFriendRequest: "Demande d’ami supprimée par ",
      friendAdded: "Ami {{username}} ajouté !",
      friendRequestButtonError: "Erreur lors du traitement de la demande d'ami",
      friendRequestEventError:
        "Erreur lors de la réception d'une demande d'ami.",
      friendRequestSendError: "Erreur lors de l'envoi de la demande d'ami.",
      emailExists: "L’adresse e‑mail existe déjà",
      emailOrUsernameExists: "L’e‑mail ou le nom d’utilisateur existe déjà",
      invalidUsernameOrPW: "Nom d’utilisateur ou mot de passe invalide",
      logoutError: "Erreur lors de la déconnexion. Veuillez réessayer.",
      passwordUpdateFailed:
        "Échec de la mise à jour du mot de passe. Veuillez réessayer.",
      passwordUpdatedSuccess: "Mot de passe mis à jour avec succès !",
      profileUpdateFailed:
        "Échec de la mise à jour du profil. Veuillez réessayer.",
      tabError: "L'onglet n'a pas pu s'initialiser.",
      twoFASetupSuccess:
        "Configuration de l’authentification à deux facteurs réussie !",
      twoFARemoveSuccess:
        "Désactivation de l’authentification à deux facteurs réussie !",
      profileUpdatedSuccess: "Profil mis à jour avec succès !",
      registrationSuccess: "Inscription de {{username}} réussie !",
      sendSuccess: "Demande d’ami envoyée avec succès à {{username}}",
      terminatedFriendship: "Fin de la relation d’amitié avec ",
      tokenRefreshFailed:
        "Échec du rafraîchissement du jeton. Veuillez réessayer.",
      userAcceptedFriendRequest:
        "Demande d’ami de <strong>{{username}}</strong> acceptée",
      userDeclinedFriendRequest:
        "Demande d’ami de <strong>{{username}}</strong> refusée",
      userRescindedFriendRequest:
        "Demande d’ami de <strong>{{username}}</strong> annulée",
      userRemovedFriend:
        "<strong>{{username}}</strong> a été supprimé de vos amis",
      userSentFriendRequest: "Demande d’ami de <strong>{{username}}</strong>",
      userStatus: "{{username}} est {{status}}",
      userVerificationError:
        "Une erreur s’est produite lors de la vérification de l’utilisateur :<br>Redirection vers la page de connexion.",
      validateTournamentNameError:
        "Une erreur s’est produite lors de la validation du nom du tournoi."
    },

    chart: {
      activity: "Activité",
      current: "Actuelle",
      loss: "Défaites",
      numPlayers: "{{num}} joueurs",
      played: "Tournois joués{{range}}",
      progress: "Progression ({{num}}-Players)",
      progression: "Taux de victoire{{range}}",
      rangeLastDays: " ({{count}} derniers jouers)",
      rangeLastMatches: " ({{count}} derniers matchs)",
      reachedThisStage: "Étape atteinte",
      scoreDiff: "Différence de score{{range}}",
      scores: "Scores{{range}}",
      selectUpTo: "Sélectionnez jusqu'à 3 amis",
      summary: "Résumé",
      win: "Victoires",
      winLoss: "Victoires vs Défaites{{range}}"
    }
  }
};
export default fr;
