import { TranslationShape } from "./en.js";
const fr: TranslationShape = {
  translation: {
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
    },
    error: {
      invalidDynamicRoutePattern:
        "Modèle de route dynamique invalide : {{pattern}}",
      matchNotFound: "Match non trouvé.",
      missingRequestID: "L'ID de la demande est manquant.",
      nextMatchNotFound: "Prochain match non trouvé.",
      noActiveToken: "Aucun jeton actif trouvé.",
      nullMatches: "Il n'y a pas de matchs.",
      requestNotFound: "Demande avec l'ID {{id}} non trouvée.",
      somethingWentWrong: "Une erreur s'est produite.",
      tournamentIDNotFound: "ID de tournoi non trouvé.",
      undefinedMatch: "Le match est indéfini",
      unexpected: "Une erreur inattendue s'est produite.",
      unknownRequestListType: "Type de liste de demandes inconnu : {{type}}",
      userNotFound: "Utilisateur non trouvé.",
      userStatsNotFound: "Statistiques de l'utilisateur non trouvées.",
      validateUser:
        "Une erreur s'est produite lors de la validation de l'utilisateur :<br>Redirection vers la page de connexion."
    },
    errorView: {
      details: "Détails : {{cause}}",
      errorStatus: "⚠️ Erreur {{status}}",
      reload: "Recharger",
      title: "Erreur"
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
      confirmDeclineRequest: "Êtes-vous sûr de vouloir refuser cette demande ?",
      confirmDeleteRequest:
        "Êtes-vous sûr de vouloir supprimer cette demande ?",
      confirmRemoveFriend: "Êtes-vous sûr de vouloir supprimer cet ami ?",
      exactUsername: "Nom d'utilisateur exact",
      friendRequests: "Demandes d'amis",
      incomingRequests: "Demandes d'amis entrantes",
      noFriends: "Vous n'avez pas encore d'amis",
      noIncoming: "Aucune demande d'ami entrante",
      noOutgoing: "Aucune demande d'ami sortante",
      outgoingRequests: "Demandes d'amis sortantes",
      sendFriendRequest: "Envoyer une demande d'ami",
      title: "Amis",
      yourFriends: "Vos amis"
    },
    gameView: {
      title: "En cours"
    },

    global: {
      avatar: "Avatar",
      confirmNewPassword: "Confirmez le nouveau mot de passe",
      continue: "Appuyez sur la touche ENTER pour continuer",
      editProfile: "Modifier votre profil",
      email: "Adresse e-mail",
      label: "{{field}} :",
      logout: "Déconnexion",
      lost: "Perdu",
      match: "Match {{matchId}}",
      matchWinner: "Match {{matchId}} gagnant",
      offline: "Hors ligne",
      online: "En ligne",
      password: "Mot de passe",
      player: "Joueur",
      playerWins: "{{player}} a gagné",
      pongGame: "Jeu de pong",
      round: "Manche {{round}}",
      submit: "Valider",
      toBeDefined: "À définir",
      tournament: "Tournoi : <strong>{{tournamentName}}</strong>",
      twoFACode: "Code 2FA",
      username: "Nom d'utilisateur",
      userNotFound: "Utilisateur non trouvé.",
      welcome: "Bienvenue",
      won: "Gagné"
    },

    homeView: {
      faqControlsLeftPaddle: "Déplacer la raquette gauche : W / S",
      faqControlsRightPaddle: "Déplacer la raquette droite : Flèches ↑ ↓ ",
      faqControlsTitle: "Contrôles",

      faqExtrasText:
        "Pong est l'un des premiers jeux vidéo jamais créés : simple, intemporel et addictif. Inspiré par TRON, cette version réinvente le classique dans un style néon.",
      faqExtrasTitle: "Infos complémentaires",
      faqGameModesSingle:
        "Partie simple : un match rapide contre l'IA ou un ami.",
      faqGameModesTitle: "Modes de jeu",

      faqGameModesTournament:
        "Tournoi : affrontez plusieurs manches jusqu'à ce qu'il ne reste qu'un champion.",
      faqTips1: "Anticipez le trajet de la balle au lieu de courir après.",
      faqTips2:
        "Utilisez les bords de la raquette pour changer l'angle de la balle.",

      faqTips3:
        "Attention ! Chaque coup de raquette augmente la vitesse de la balle.",
      faqTipsTitle: "Conseils",
      faqTitle: "FAQ",
      helloUser: "Bonjour {{username}}!",

      tagline: "Enter the Grid. Master the Pong.",
      title: "Accueil"
    },
    invalid: {
      emailEmpty: "L'adresse e-mail ne peut pas être vide.",
      emailFormat:
        "L'adresse e-mail doit être au format d'une adresse e-mail valide.",
      emailOrUsernameEmpty:
        "Veuillez saisir un nom d'utilisateur ou une adresse e-mail.",
      emailOrUsernameFormat:
        "Le nom d'utilisateur ou l'adresse e-mail doit être valide.",
      fillAtLeastOneField: "Veuillez remplir au moins un champ.",
      fillInUsername: "Veuillez donner un nom d'utilisateur.",
      friendNotSelf: "Vous ne pouvez pas vous ajouter en ami.",
      friendRequestAlreadySent: "Vous avez déjà envoyé une demande d'ami.",
      friendsAlready: "Vous êtes déjà amis.",
      imageFileEmpty: "Veuillez sélectionner un fichier à télécharger.",
      imageFileFormat: "Veuillez télécharger un fichier image valide.",
      nicknameEmpty: "Le pseudonyme ne peut pas être vide.",
      nicknameFormat:
        "Le pseudonyme doit être composé de 3 à 20 caractères et peut comprendre des lettres, des chiffres ou les caractères spéciaux suivants : -!?_$.",
      nicknameUniqueness: "Le pseudonyme doit être unique.",

      passwordConfirmation:
        "La confirmation du mot de passe ne correspond pas au mot de passe saisi.",
      passwordConfirmationEmpty:
        "Veuillez saisir à nouveau votre mot de passe.",
      passwordEmpty: "Le mot de passe ne peut pas être vide.",
      passwordFormat:
        "Le mot de passe doit être composé de 10 à 64 caractères et contenir au moins un chiffre, une lettre majuscule et une lettre minuscule, ainsi que l'un des caractères spéciaux suivants : @$!%*?&",
      playerSelection: "Veuillez sélectionner le nombre de joueurs.",
      tournamentNameEmpty: "Le nom du tournoi ne peut pas être vide.",
      tournamentNameFormat:
        "Le nom du tournoi doit être composé de 3 à 20 caractères et ne peut contenir que des lettres, des chiffres ou les caractères spéciaux suivants : -!?_$.",
      tournamentNameUniqueness: "Le nom du tournoi doit être unique.",
      twoFABackupCode: "Le code de secours est invalide.",
      twoFABackupCodeEmpty: "Le code de secours ne peut pas être vide.",
      twoFABackupCodeFormat: "Le code de secours doit contenir huit chiffres.",
      twoFACode: "Le code 2FA est invalide.",
      twoFACodeEmpty: "Le code 2FA ne peut pas être vide.",
      twoFACodeFormat: "Le code 2FA doit contenir six chiffres.",
      usernameEmpty: "Le nom d'utilisateur ne peut pas être vide.",
      usernameFormat:
        "Le nom d'utilisateur doit être composé de 3 à 20 caractères et peut comprendre des lettres, des chiffres ou les caractères spéciaux suivants : -!?_$.",
      usernameUniqueness: "Le nom d'utilisateur doit être unique."
    },
    loginView: {
      title: "Connexion",
      usernameOrEmail: "Nom ou adresse mail"
    },
    matchAnnouncementView: {
      abortTournament: "Annuler le tournoi",
      nextMatch: "Prochain match à jouer",
      roundMatch: "Manche {{round}} - Match {{match}}",
      skipMatch: "Sauter le match",
      spectateMatch: "Observer le match",
      startMatch: "Démarrer le match",
      title: "Prochain match !"
    },
    newGameView: {
      aiOption: "Optionnel : activez l'IA pour contrôler l'autre joueur.",
      enterNickname: "Entrez un pseudonyme pour chaque joueur.",
      selectPlayer: "Sélectionnez quel joueur sera contrôlé par {{username}}.",
      startGame: "Démarrer le jeu",
      title: "Nouveau jeu"
    },
    newTournamentView: {
      confirmAbortTournament: "Voulez-vous vraiment annuler le tournoi ?",
      enterTournamentName: "Entrez le nom du tournoi",
      numberOfPlayers: "Nombre de joueurs",
      players16: "16 joueurs",
      players4: "4 joueurs",
      players8: "8 joueurs",
      selectNumberPlayers: "Sélectionnez le nombre de joueurs",
      startTournament: "Démarrer le tournoi",
      title: "Nouveau tournoi",
      tournamentName: "Nom du tournoi"
    },
    nicknameInput: {
      aiPlayer: "Joueur IA",
      aiStrength: "Difficulté de l'IA",
      aiStrengthEasy: "Facile",
      aiStrengthHard: "Difficile",
      aiStrengthMedium: "Moyenne",
      enterYourNickname: "Entrez votre pseudonyme",
      playerChoice: "{{username}} joue en tant que joueur {{i}}",
      playerNickname: "Pseudonyme du joueur {{i}}"
    },
    playerNicknamesView: {
      aiOptions:
        "Optionnel : activez l'IA pour contrôler un ou plusieurs d'autres joueurs.",
      enterPlayerNicknames: "Entrez les pseudonymes des joueurs",
      submitNicknames: "Valider les pseudonymes",
      title: "Pseudonymes des joueurs"
    },
    profileView: {
      cannotChangeEmailOrPW:
        "Vous ne pouvez pas changer votre adresse e-mail ou votre mot de passe.",
      changeAvatar: "Modifiez votre avatar.",
      changePassword: "Modifiez votre mot de passe.",
      changePasswordButton: "Modifier le mot de passe",
      chooseFile: "Choisissez un fichier image",
      currentPassword: "Mot de passe actuel",
      deleteAvatar: "Supprimez votre avatar",
      deleteAvatarConfirm: "Voulez vous vraiment supprimer votre avatar?",
      newPassword: "Nouveau mot de passe",
      noFileSelected: "Aucun fichier sélectionné",
      saveChanges: "Enregistrer",
      signedInWithGoogle: "Connecté avec Google",
      title: "Votre profil",
      updateProfile: "Mettez à jour votre profil.",
      uploadYourAvatar: "Téléchargez votre avatar"
    },
    registerView: {
      register: "Inscrivez-vous",
      title: "S'inscrire"
    },
    resultsView: {
      bracket: "Arbre du tournoi",
      champion: "Champion",
      congratulations: "Félicitations pour la victoire !",
      finish: "Marquer comme terminé",
      title: "Résultats",
      tournamentResults: "Résultats du tournoi"
    },
    settingsView: {
      activateTwoFA: "Activer",
      confirmPassword: "Confirmation",
      dangerZone: "Zone dangereuse",
      deactivateTwoFA: "Désactiver",
      deactivateTwoFASetup: "Désactiver l'authentification à deux facteurs",
      deleteProfile: "Supprimez votre profil",
      deleteProfileConfirm: "Voulez vous vraiment supprimer votre profil?",
      displayTwoFASetup:
        "Afficher la configuration de l'authentification à deux facteurs",
      editTwoFASetup:
        "Modifier la configuration de l'authentification à deux facteurs",
      enterTwoFACode: "Entrez votre code 2FA :",
      preferredLanguage: "Choisissez votre langue préférée.",
      saveLanguage: "Enregistrer la langue",
      settings: "Configurez vos préférences et paramètres ici.",
      title: "Paramètres",
      twoFAActivated: ["L'authentification à deux facteurs est activée"],
      twoFABackupCode: "Codes de secours",
      twoFABackupCodeInfo: [
        "Voici vos codes de secours.",
        "Copiez-les ou téléchargez-les.",
        "",
        "Ils ne seront plus affichés par la suite."
      ],
      twoFADownloadBackupCodes: "Télécharger les codes",
      twoFAGenerateBackupCodes: "Générer des codes de secours",
      twoFAInfo: [
        "Activer l'authentification à deux facteurs :",
        "",
        "Veuillez utiliser une application d'authentification",
        "pour scanner le code QR ci-dessous."
      ],
      twoFASetup: "Paramètres de l'authentification à deux facteurs"
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
      player1Score: "Score du joueur 1",
      player2: "Joueur 2",
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
      avatarDeleteFailed: "Échec d'effacement de l'avatar. Veuillez réessayer.",
      avatarDeleteSuccess: "Avatar supprimé avec succès!",
      avatarUploadedSuccess: "Avatar téléchargé avec succès !",
      avatarUploadFailed:
        "Échec du téléchargement de l'avatar. Veuillez réessayer.",
      chartCannotRemoveYourself: "Vous ne pouvez pas vous supprimer.",
      chartCompareMaxThree: "Vous pouvez comparer un maximum de 3 amis.",
      chartError: "Un diagramme n'a pas pu être initialisé",
      connectionLost:
        "Connexion perdue - nouvelle tentative dans {{delay}} secondes… (Tentative {{attempt}} sur {{maxAttempts}})",
      connectionReestablished: "Connexion rétablie",
      connectionUnavailable:
        "Impossible de se reconnecter. Tentatives arrêtées jusqu'à l'actualisation.",
      emailExists: "L'adresse e-mail existe déjà",
      emailExistsWithGoogle:
        "Cet e-mail est déjà utilisé avec Google. Connectez-vous via Google.",
      emailOrUsernameExists: "L'e-mail ou le nom d'utilisateur existe déjà",
      emailOrUsernameNotExist: "L'e-mail ou le nom d'utilisateur n'existe pas",
      friendAcceptedFriendRequest:
        "<strong>{{username}}</strong> a accepté votre demande d'ami",
      friendAdded: "Ami <strong>{{username}}</strong> ajouté",
      friendDeclinedFriendRequest:
        "<strong>{{username}}</strong> a refusé votre demande d'ami",
      friendRemovedFriend:
        "<strong>{{username}}</strong> ne veut plus être ami avec vous",
      friendRequestButtonError: "Erreur lors du traitement de la demande d'ami",
      friendRequestEventError:
        "Erreur lors de la réception d'une demande d'ami.",
      friendRescindedFriendRequest:
        "<strong>{{username}}</strong> a annulé sa demande d'ami",
      friendSentFriendRequest:
        "<strong>{{username}}</strong> vous a envoyé une demande d'ami",
      gameSaveSuccess: "Jeu enregistré avec succès",
      gameSaveFailed: "Impossible d'enregistrer le jeu",
      invalidToken: "Token non valide",
      invalidUsernameOrPW: "Nom d'utilisateur ou mot de passe invalide",
      loginError: "Erreur lors de la connexion. Veuillez réessayer.",
      logoutError: "Erreur lors de la déconnexion. Veuillez réessayer.",
      passwordUpdatedSuccess: "Mot de passe mis à jour avec succès !",
      passwordUpdateFailed:
        "Échec de la mise à jour du mot de passe. Veuillez réessayer.",
      profileDeleteFailed:
        "Échec de l' effacement du profil. Veuillez réessayer.",
      profileDeleteSuccess: "Profil supprimé avec succès !",
      profileUpdatedSuccess: "Profil mis à jour avec succès !",
      profileUpdateFailed:
        "Échec de la mise à jour du profil. Veuillez réessayer.",
      registrationSuccess: "Inscription de {{username}} réussie !",
      somethingWentWrong: "Quelque chose s'est mal passé",
      tabError: "L'onglet n'a pas pu s'initialiser.",
      tokenRefreshFailed:
        "Échec du rafraîchissement du jeton. Veuillez réessayer.",
      tournamentAbortFailed:
        "Le tournoi n'a pas pu être annulé. Veuillez réessayer.",
      tournamentAbortSuccess: "Tournoi annulé avec succès",
      tournamentFinishFailed:
        "Le tournoi n'a pas pu être terminé. Veuillez réessayer.",
      tournamentFinishSuccess: "Tournoi terminé avec succès !",
      twoFARemoveSuccess:
        "Désactivation de l'authentification à deux facteurs réussie !",
      twoFASetupSuccess:
        "Configuration de l'authentification à deux facteurs réussie !",
      userAcceptedFriendRequest: "Acceptée - demande d'ami de ",
      userDeclinedFriendRequest: "Refusée - demande d'ami de ",
      userRemovedFriendship: "Fin de la relation d'amitié avec ",
      userRescindedFriendRequest: "Annulée - demande d'ami de ",
      userSendFriendRequestSuccess:
        "Demande d'ami envoyée avec succès à <strong>{{username}}</strong>",
      userSendRequestFailed: "Erreur lors de l'envoi de la demande d'ami.",
      userStatus: "<strong>{{username}}</strong> est {{status}}",
      userVerificationError:
        "Une erreur s'est produite lors de la vérification de l'utilisateur :<br>Redirection vers la page de connexion.",
      validateTournamentNameError:
        "Une erreur s'est produite lors de la validation du nom du tournoi."
    },
    twoFABackupCodeVerifyView: {
      enterTwoFABackupCode: "Entrez votre code de secours :",
      title: "Vérification du code de secours",
      twoFABackupCode: "Code de secours"
    },

    twoFAVerifyView: {
      enterTwoFACode: "Entrez votre code 2FA :",
      title: "Vérification du code 2FA",
      useBackupCode: "Utiliser le code de secours"
    }
  }
};
export default fr;
