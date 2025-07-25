import { TranslationShape } from "./en.js";

const de: TranslationShape = {
  translation: {
    error: {
      invalidDynamicRoutePattern:
        "Ungültiges dynamisches Routenmuster: {{pattern}}",
      matchNotFound: "Spiel nicht gefunden.",
      missingRequestID: "Anfrage-ID fehlt.",
      nextMatchNotFound: "Nächstes Spiel nicht gefunden.",
      noActiveToken: "Keinen aktiven Token gefunden.",
      nullMatches: "Es gibt keine Spiele.",
      requestNotFound: "Anfrage mit ID {{id}} nicht gefunden.",
      somethingWentWrong: "Etwas ist schiefgelaufen.",
      tournamentIDNotFound: "Turnier-ID nicht gefunden.",
      undefinedMatch: "Spiel ist nicht definiert",
      unexpected: "Ein unerwarteter Fehler ist aufgetreten.",
      unknownRequestListType: "Unbekannter Anfrage-Typ: {{type}}",
      userNotFound: "Benutzer nicht gefunden.",
      userStatsNotFound: "Spielerstatistiken nicht gefunden.",
      validateUser:
        "Fehler bei der Benutzerverifizierung:<br>Weiterleitung zur Anmeldung."
    },

    errorView: {
      details: "Details: {{cause}}",
      errorStatus: "⚠️ Fehler {{status}}",
      title: "Fehler",
      reload: "Neu laden"
    },

    friendListItem: {
      accept: "Annehmen",
      decline: "Ablehnen",
      delete: "Löschen",
      pending: "Ausstehend",
      remove: "Entfernen"
    },

    friendsView: {
      addFriend: "Freund hinzufügen",
      confirmDeclineRequest: "Möchtest du diese Anfrage wirklich ablehnen?",
      confirmDeleteRequest: "Möchtest du diese Anfrage wirklich löschen?",
      confirmRemoveFriend: "Möchtest du diesen Freund wirklich entfernen?",
      exactUsername: "Exakter Benutzername",
      friendRequests: "Freundschaftsanfragen",
      title: "Freunde",
      incomingRequests: "Eingehende Anfragen",
      noFriends: "Du hast noch keine Freunde",
      noIncoming: "Keine eingehenden Anfragen",
      noOutgoing: "Keine ausgehenden Anfragen",
      outgoingRequests: "Ausgehende Anfragen",
      sendFriendRequest: "Freundschaftsanfrage senden",
      yourFriends: "Deine Freunde"
    },

    gameView: {
      title: "Jetzt spielen"
    },

    global: {
      avatar: "Avatar",
      confirmNewPassword: "Neues Passwort bestätigen",
      continue: "ENTER drücken, um fortzufahren",
      editProfile: "Profil bearbeiten",
      email: "E-Mail-Adresse",
      label: "{{field}}:",
      logout: "Abmelden",
      lost: "Verloren",
      match: "Spiel {{matchId}}",
      offline: "Offline",
      online: "Online",
      password: "Passwort",
      pongGame: "Pong-Spiel",
      player: "Spieler",
      playerWins: "{{player}} gewinnt",
      round: "Runde {{round}}",
      toBeDefined: "Noch nicht definiert",
      tournament: "Turnier: <strong>{{tournamentName}}</strong>",
      username: "Benutzername",
      userNotFound: "Benutzer nicht gefunden.",
      welcome: "Willkommen",
      winnerMatch: "Sieg im Spiel {{matchId}}",
      won: "Gewonnen"
    },

    homeView: {
      helloUser: "Hallo {{username}}!<br />Das ist die Startseite",
      title: "Startseite"
    },

    invalid: {
      emailEmpty: "E-Mail-Adresse darf nicht leer sein.",
      emailFormat: "E-Mail-Adresse muss gültig sein.",
      emailOrUsernameEmpty:
        "Bitte gib einen Benutzernamen oder eine E-Mail-Adresse ein.",
      emailOrUsernameFormat:
        "Der Benutzername oder die E-Mail-Adresse muss gültig sein.",
      fillAtLeastOneField: "Bitte fülle mindestens ein Feld aus.",
      fillInUsername: "Bitte gib einen Benutzernamen ein.",
      imageFileEmpty: "Bitte wähle eine Datei zum Hochladen aus.",
      imageFileFormat: "Bitte lade eine gültige Bilddatei hoch.",
      nicknameEmpty: "Spitzname darf nicht leer sein.",
      nicknameFormat:
        "Spitzname muss 3 bis 20 Zeichen haben und darf Buchstaben, Zahlen oder folgende Sonderzeichen enthalten: -!?_$.",
      nicknameUniqueness: "Spitzname muss eindeutig sein.",
      passwordEmpty: "Passwort darf nicht leer sein.",
      passwordFormat:
        "Passwort muss 10 bis 64 Zeichen enthalten und mindestens eine Zahl, einen Groß- und Kleinbuchstaben sowie ein Sonderzeichen: @$!%*?&",
      passwordConfirmationEmpty: "Bitte wiederhole dein Passwort",
      passwordConfirmation: "Passwörter stimmen nicht überein.",
      playerSelection: "Bitte Anzahl der Spieler auswählen.",
      tournamentNameEmpty: "Turniername darf nicht leer sein.",
      tournamentNameFormat:
        "Turniername muss 3 bis 20 Zeichen enthalten und darf Buchstaben, Zahlen oder folgende Sonderzeichen enthalten: -!?_$.",
      tournamentNameUniqueness: "Turniername muss eindeutig sein.",
      usernameEmpty: "Benutzername darf nicht leer sein.",
      usernameFormat:
        "Benutzername muss 3 bis 20 Zeichen enthalten und darf Buchstaben, Zahlen oder folgende Sonderzeichen enthalten: -!?_$.",
      usernameUniqueness: "Benutzername muss eindeutig sein."
    },

    loginView: {
      title: "Anmelden",
      usernameOrEmail: "Benutzername oder E-Mail-Adresse"
    },

    matchAnnouncementView: {
      abortTournament: "Turnier abbrechen",
      nextMatch: "Nächstes Spiel:",
      title: "Nächstes Spiel!",
      roundMatch: "Runde {{round}} – Spiel {{match}}",
      startMatch: "Spiel starten",
      tournamentStatus: "Turnierstatus"
    },

    newGameView: {
      title: "Neues Spiel",
      selectPlayer:
        "Wähle aus, welcher Spieler von {{username}} gesteuert wird",
      startGame: "Spiel starten"
    },

    newTournamentView: {
      confirmAbortTournament: "Möchtest du das Turnier wirklich abbrechen?",
      enterTournamentName: "Gib den Turniernamen ein",
      newTournamentDescription:
        "Gib den Turniernamen ein und wähle die Anzahl der Spieler",
      title: "Neues Turnier",
      numberOfPlayers: "Anzahl der Spieler",
      players4: "4 Spieler",
      players8: "8 Spieler",
      players16: "16 Spieler",
      startTournament: "Turnier starten",
      tournamentName: "Turniername"
    },

    nicknameInput: {
      enterYourNickname: "Gib deinen Spitznamen ein",
      playerChoice: "Ich spiele als Spieler {{i}}",
      playerNickname: "Spitzname von Spieler {{i}}"
    },

    playerNicknamesView: {
      enterPlayerNicknames: "Gib die Spitznamen der Spieler ein",
      title: "Spieler-Spitznamen",
      selectControlledPlayer:
        "Wähle aus, welcher Spieler von {{username}} gesteuert wird",
      submitNicknames: "Spitznamen bestätigen"
    },

    profileView: {
      cannotChangeEmailOrPW:
        "Du kannst deine E-Mail-Adresse oder dein Passwort nicht ändern.",
      changeAvatar: "Ändere deinen Avatar unten.",
      changePasswordButton: "Passwort ändern",
      changePassword: "Ändere dein Passwort unten.",
      chooseFile: "Wähle eine Bilddatei für deinen Avatar",
      currentPassword: "Aktuelles Passwort",
      newPassword: "Neues Passwort",
      noFileSelected: "Keine Datei ausgewählt",
      saveChanges: "Änderungen speichern",
      signedInWithGoogle: "Mit Google angemeldet",
      updateProfile: "Aktualisiere unten deine Profilinformationen.",
      uploadYourAvatar: "Lade deinen Avatar hoch",
      title: "Dein Profil"
    },

    registerView: {
      register: "Hier registrieren",
      title: "Registrieren"
    },

    resultsView: {
      bracket: "Turnierbaum",
      champion: "Champion",
      congratulations: "Herzlichen Glückwunsch zum Sieg!",
      finish: "Als abgeschlossen markieren",
      title: "Ergebnisse",
      tournamentResults: "Turnierergebnisse"
    },

    settingsView: {
      preferredLanguage: "Wähle dein bevorzugte Sprache aus.",
      saveLanguage: "Sprache speichern",
      settings: "Lege hier deine Einstellungen und Präferenzen fest.",
      title: "Einstellungen"
    },

    statsView: {
      date: "Datum",
      friendOnly: "Du musst befreundet sein, um die Match-Historie zu sehen",
      joined: "Beigetreten am",
      matchHistory: "Spielverlauf",
      played: "Gespielt",
      player1: "Spieler 1",
      player2: "Spieler 2",
      player1Score: "Spieler 1 Punkte",
      player2Score: "Spieler 2 Punkte",
      result: "Ergebnis",
      title: "Statistiken",
      tournament: "Turnier",
      winRate: "Siegquote"
    },

    toast: {
      acceptedFriendRequest: "Freundschaftsanfrage angenommen von ",
      avatarUploadFailed:
        "Avatar konnte nicht hochgeladen werden. Bitte versuche es erneut.",
      avatarUploadedSuccess: "Avatar erfolgreich hochgeladen!",
      connectionLost:
        "Verbindung verloren - erneuter Versuch in {{delay}} Sekunden... (Versuch {{attempt}} von {{maxAttempts}})",
      connectionReestablished: "Verbindung wiederhergestellt",
      connectionUnavailable:
        "Verbindung nicht wiederherstellbar. Versuche gestoppt bis Seite neu geladen wird.",
      declinedFriendRequest: "Freundschaftsanfrage abgelehnt von ",
      deletedFriendRequest: "Freundschaftsanfrage gelöscht von ",
      friendAdded: "Freund {{username}} hinzugefügt!",
      friendRequestButtonError:
        "Fehler beim Verarbeiten der Freundschaftsanfrage",
      emailExists: "Diese E-Mail-Adresse ist bereits registriert",
      emailOrUsernameExists: "E-Mail oder Benutzername existiert bereits",
      invalidUsernameOrPW: "Ungültiger Benutzername oder Passwort",
      logoutError: "Fehler beim Abmelden. Bitte versuche es erneut.",
      passwordUpdateFailed:
        "Passwort konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      passwordUpdatedSuccess: "Passwort erfolgreich aktualisiert!",
      profileUpdateFailed:
        "Profil konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      profileUpdatedSuccess: "Profil erfolgreich aktualisiert!",
      registrationSuccess: "Registrierung von {{username}} erfolgreich!",
      sendSuccess: "Anfrage erfolgreich an {{username}} gesendet",
      terminatedFriendship: "Freundschaft beendet mit ",
      tokenRefreshFailed:
        "Token-Aktualisierung fehlgeschlagen. Bitte erneut versuchen.",
      userAcceptedFriendRequest:
        "Anfrage von <strong>{{username}}</strong> angenommen",
      userDeclinedFriendRequest:
        "Anfrage von <strong>{{username}}</strong> abgelehnt",
      userRescindedFriendRequest:
        "Anfrage von <strong>{{username}}</strong> zurückgezogen",
      userRemovedFriend:
        "<strong>{{username}}</strong> wurde aus deiner Freundesliste entfernt",
      userSentFriendRequest: "Anfrage von <strong>{{username}}</strong>",
      userStatus: "{{username}} ist {{status}}",
      userVerificationError:
        "Fehler bei der Benutzerverifizierung:<br>Weiterleitung zur Anmeldung.",
      validateTournamentNameError:
        "Fehler bei der Validierung des Turniernamens."
    }
  }
};

export default de;
