import { TranslationShape } from "./en.js";

const fr: TranslationShape = {
  translation: {
    error: {
      invalidDynamicRoutePattern:
        "Modèle de route dynamique invalide: {{pattern}}",
      matchNotFound: "Match non trouvé.",
      missingRequestID: "L'ID de la demande est manquant.",
      nextMatchNotFound: "Prochain match non trouvé.",
      noActiveToken: "Aucun token actif trouvé.",
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
        "Une erreur s'est produite lors de la validation de l'utilisateur:<br>Redirection vers la page login."
    },

    errorView: {
      details: "Détails : {{cause}}",
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
      confirmDeclineRequest: "Êtes-vous sûr de vouloir refuser cette demande ?",
      confirmDeleteRequest:
        "Êtes-vous sûr de vouloir supprimer cette demande ?",
      confirmRemoveFriend: "Êtes-vous sûr de vouloir supprimer cet ami ?",
      exactUsername: "Nom d'utilisateur exact",
      friendRequests: "Demandes d'amis",
      title: "Amis",
      incomingRequests: "Demandes d'amis entrantes",
      noFriends: "Vous n'avez pas encore d'amis",
      noIncoming: "Aucune demande d'ami entrante",
      noOutgoing: "Aucune demande d'ami sortante",
      outgoingRequests: "Demandes d'amis sortantes",
      sendFriendRequest: "Envoyer une demande d'ami",
      yourFriends: "Vos amis"
    },

    gameView: {
      title: "Now Playing"
    },

    global: {
      avatar: "Avatar",
      confirmNewPassword: "Confirmez le nouveau mot de passe",
      continue: "Appuyez sur la touche ENTER pour continuer",
      editProfile: "Modifier votre profil",
      email: "Addresse mail",
      label: "{{field}}:",
      logout: "Déconnexion",
      lost: "Perdu",
      match: "Match {{matchId}}",
      offline: "Hors ligne",
      online: "En ligne",
      password: "Mot de passe",
      pongGame: "Jeu de pong",
      player: "Joueur",
      playerWins: "{{player}} a gagné",
      round: "Manche {{round}}",
      toBeDefined: "À définir",
      tournament: "Tournoi : <strong>{{tournamentName}}</strong>",
      username: "Nom d'utilisateur",
      userNotFound: "Utilisateur non trouvé.",
      welcome: "Bienvenue",
      winnerMatch: "Match gagnant {{matchId}}",
      won: "Gagné"
    },

    homeView: {
      helloUser: "Bonjour {{username}} !<br />Ceci est la page d'accueil",
      title: "Accueil"
    },

    invalid: {
      emailEmpty: "L'addresse mail ne peut pas être vide.",
      emailFormat:
        "L'addresse mail doit être au format d'une addresse mail valide.",
      emailOrUsernameEmpty:
        "Veuillez saisir un nom d'utilisateur ou une addresse mail.",
      emailOrUsernameFormat:
        "Le nom d'utilisateur ou l'addresse mail doit être valide.",
      fillAtLeastOneField: "Veuillez remplir au moins un champ.",
      fillInUsername: "Veuillez donner un nom d'utilisateur.",
      imageFileEmpty: "Veuillez sélectionner un fichier à télécharger.",
      imageFileFormat: "Veuillez télécharger un fichier image valide.",
      nicknameEmpty: "Le pseudonyme ne peut pas être vide.",
      nicknameFormat:
        "Le pseudonyme doit être composé de 3 à 20 caractères et peut comprendre des lettres, des chiffres ou des caractères spéciaux suivants : -!?_$.",
      nicknameUniqueness: "Le pseudonyme doit être unique.",
      passwordEmpty: "Le mot de passe ne peut pas être vide.",
      passwordFormat:
        "Le mot de passe doit être composé de 10 à 64 caractères et doit contenir au moins un chiffre, une lettre majuscule et une lettre minuscule, ainsi que l'un des caractères spéciaux suivants : @$!%*?&",
      passwordConfirmationEmpty: "Veuillez saisir à nouveau votre mot de passe",
      passwordConfirmation:
        "La confirmation du mot de passe ne correspond pas au mot de passe saisi.",
      playerSelection: "Veuillez sélectionner le nombre de joueurs.",
      tournamentNameEmpty: "Le nom du tournoi ne peut pas être vide.",
      tournamentNameFormat:
        "Le nom du tournoi doit être composé de 3 à 20 caractères et ne peut contenir que des lettres, des chiffres ou des caractères spéciaux suivants :-!?_$.",
      tournamentNameUniqueness: "Le nom du tournoi doit être unique.",
      usernameEmpty: "Le nom d'utilisateur ne peut pas être vide.",
      usernameFormat:
        "Le nom d'utilisateur doit être composé de 3 à 20 caractères et peut comprendre des lettres, des chiffres ou des caractères spéciaux suivants : -!?_$.",
      usernameUniqueness: "Le nom d'utilisateur doit être unique."
    },

    loginView: {
      title: "Login",
      usernameOrEmail: "Nom d'utilisateur ou addresse mail"
    },

    matchAnnouncementView: {
      abortTournament: "Annuler le Tournoi",
      nextMatch: "Prochain match à jouer:",
      title: "Prochain Match!",
      roundMatch: "Manche {{round}} - Match {{match}}",
      startMatch: "Démarrer le Match",
      tournamentStatus: "Statut du Tournoi"
    },

    newGameView: {
      title: "Nouveau Jeu",
      selectPlayer: "Sélectionnez quel joueur sera contrôlé par {{username}}",
      startGame: "Démarrer le Jeu"
    },

    newTournamentView: {
      confirmAbortTournament: "Voulez-vous vraiment annuler le tournoi ?",
      enterTournamentName: "Entrez le nom du tournoi",
      newTournamentDescription:
        "Entrez le nom du tournoi et sélectionnez le nombre de joueurs",
      title: "Nouveau Tournoi",
      numberOfPlayers: "Nombre de joueurs",
      players4: "4 joueurs",
      players8: "8 joueurs",
      players16: "16 joueurs",
      startTournament: "Démarrer le tournoi",
      tournamentName: "Nom du tournoi"
    },

    nicknameInput: {
      enterYourNickname: "Entrez votre pseudonyme",
      playerChoice: "Je joue en tant que joueur {{i}}",
      playerNickname: "Pseudonyme de joueur {{i}}"
    },

    playerNicknamesView: {
      enterPlayerNicknames: "Entrez les pseudonymes des joueurs",
      title: "Pseudonymes des joueurs",
      selectControlledPlayer:
        "Sélectionnez quel joueur sera contrôlé par {{username}}",
      submitNicknames: "Valider les pseudonymes"
    },

    profileView: {
      cannotChangeEmailOrPW:
        "Vous ne pouvez pas changer votre adresse e-mail ou votre mot de passe.",
      changeAvatar: "Modifiez votre avatar ci-dessous.",
      changePasswordButton: "Modifier le mot de passe",
      changePassword: "Modifiez votre mot de passe ci-dessous.",
      chooseFile: "Choisissez un fichier image pour votre avatar",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      noFileSelected: "Aucun fichier sélectionné",
      saveChanges: "Enregistrer les modifications",
      signedInWithGoogle: "Connecté avec Google",
      updateProfile:
        "Mettez à jour les informations de votre profil ci-dessous.",
      uploadYourAvatar: "Téléchargez votre avatar",
      title: "Votre Profil"
    },

    registerView: {
      register: "Inscrivez-vous ici",
      title: "S'inscrire"
    },

    resultsView: {
      bracket: "Arbre du tournoi",
      champion: "Champion",
      congratulations: "Félicitations pour la victoire !",
      finish: "Marquer comme terminé",
      title: "Résultats",
      tournamentResults: "Résultats du Tournoi"
    },

    settingsView: {
      preferredLanguage: "Choisissez votre langue préférée.",
      saveLanguage: "Enregistrer la langue",
      settings: "Configurez vos préférences et paramètres ici.",
      title: "Paramètres"
    },

    statsView: {
      dashboard: "Tableau",
      date: "Date",
      details: "Détails",
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
      winRate: "Taux de victoire",
      winstreakCur: "Série de victoires",
      winstreakMax: "Max-Série"
    },

    toast: {
      acceptedFriendRequest: "Demande d'ami acceptée par ",
      avatarUploadFailed:
        "Échec du téléchargement de l'avatar. Veuillez réessayer.",
      avatarUploadedSuccess: "Avatar téléchargé avec succès !",
      chartError: "Un graphique n'a pas pu être initialisé",
      connectionUnavailable:
        "Impossible de se reconnecter. Tentatives arrêter jusqu'à l'actualisation.",
      connectionLost:
        "Connexion perdue - nouvelle tentative dans {{delay}} secondes... (Tentative {{attempt}} de {{maxAttempts}})",
      connectionReestablished: "Connexion rétablie",
      declinedFriendRequest: "Demande d'ami refusée par ",
      deletedFriendRequest: "Demande d'ami supprimée par ",
      friendAdded: "Ami {{username}} ajouté !",
      friendRequestButtonError: "Erreur lors du traitement de la demande d'ami",
      emailExists: "L'addresse mail existe déjà",
      emailOrUsernameExists: "L'email ou le nom d'utilisateur existe déjà",
      invalidUsernameOrPW: "Nom d'utilisateur ou mot de passe invalide",
      logoutError: "Erreur lors de la déconnexion. Veuillez réessayer.",
      passwordUpdateFailed:
        "Échec de la mise à jour du mot de passe. Veuillez réessayer.",
      passwordUpdatedSuccess: "Mot de passe mis à jour avec succès !",
      profileUpdateFailed:
        "Échec de la mise à jour du profil. Veuillez réessayer.",
      profileUpdatedSuccess: "Profil mis à jour avec succès !",
      registrationSuccess: "Inscription de {{username}} réussie !",
      sendSuccess: "Demande d'ami envoyée avec succès à {{username}}",
      terminatedFriendship: "Fin de la relation d'amitié avec ",
      tokenRefreshFailed:
        "Échec du rafraîchissement du token. Veuillez réessayer.",
      userAcceptedFriendRequest:
        "Demande d'ami de <strong>{{username}}</strong> acceptée",
      userDeclinedFriendRequest:
        "Demande d'ami de <strong>{{username}}</strong> refusée",
      userRescindedFriendRequest:
        "Demande d'ami de <strong>{{username}}</strong> annulée",
      userRemovedFriend:
        "<strong>{{username}}</strong> a été supprimé de vos amis",
      userSentFriendRequest: "Demande d'ami de <strong>{{username}}</strong>",
      userStatus: "{{username}} est {{status}}",
      userVerificationError:
        "Une erreur s'est produite lors de la vérification de l'utilisateur:<br>Redirection vers la page de connexion.",
      validateTournamentNameError:
        "Une erreur s'est produite lors de la validation du nom du tournoi."
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
      summary: "Résumé",
      win: "Victoires",
      winLoss: "Victoires vs Défaites{{range}}"
    }
  }
};

export default fr;
