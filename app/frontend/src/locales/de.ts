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
      submit: "Bestätigen",
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
      twoFACode: "2FA-Code",
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
      helloUser: "Hallo {{username}}!",
      tagline: "Enter the Grid. Master the Pong.",
      title: "Startseite",

      faqTitle: "FAQ",
      faqGameModesTitle: "Spielmodi",
      faqGameModesSingle:
        "Einzelspiel: Ein schnelles Match gegen die KI oder einen Freund.",
      faqGameModesTournament:
        "Turnier: Spiele mehrere Runden, bis ein Champion übrig bleibt.",

      faqControlsTitle: "Steuerung",
      faqControlsRightPaddle: "Rechten Schläger bewegen: Pfeiltasten ↑ ↓",
      faqControlsLeftPaddle: "Linken Schläger bewegen: W / S",

      faqTipsTitle: "Tipps",
      faqTips1:
        "Antizipiere den Pfad des Balls voraus, statt ihm hinterherzulaufen.",
      faqTips2:
        "Treffe den Ball mit den Kanten des Schlägers, um den Winkel zu verändern.",
      faqTips3:
        "Sei vorsichtig! Jeder Schlägerkontakt erhöht die Geschwindigkeit des Balls.",

      faqExtrasTitle: "Hintergrundinfos",
      faqExtrasText:
        "Pong ist eines der ersten Videospiele überhaupt: einfach, zeitlos und süchtig machend. Inspiriert vom Blockbuster TRON, wird hier der Klassiker in einem neonbeleuchteten Stil neu interpretiert."
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
      friendNotSelf: "Du kannst dich nicht selbst als Freund hinzufügen.",
      friendRequestAlreadySent:
        "Du hast bereits eine Freundschaftsanfrage gesendet.",
      friendsAlready: "Ihr seid bereits befreundet.",
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
      twoFACode: "2FA-Code ist falsch.",
      twoFACodeEmpty: "2FA-Code darf nicht leer sein.",
      twoFACodeFormat: "2FA-Code muss eine sechsstellige Zahl sein.",
      twoFABackupCode: "Backup-Code ist falsch.",
      twoFABackupCodeEmpty: "Backup-Code darf nicht leer sein.",
      twoFABackupCodeFormat: "Backup-Code muss eine achtstellige Zahl sein.",
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
      usernameOrEmail: "Nutzername oder Mail-Adresse"
    },

    twoFAVerifyView: {
      title: "2FA-Code Verifizierung",
      enterTwoFACode: "Gib den 2FA-Code ein:",
      useBackupCode: "Backup-Code verwenden"
    },

    twoFABackupCodeVerifyView: {
      title: "Backup-Code Verifizierung",
      twoFABackupCode: "Backup-Code",
      enterTwoFABackupCode: "Gib den Backup-Code ein:"
    },

    matchAnnouncementView: {
      abortTournament: "Turnier abbrechen",
      nextMatch: "Nächstes Spiel",
      title: "Nächstes Spiel!",
      roundMatch: "Runde {{round}} - Spiel {{match}}",
      startMatch: "Spiel starten",
      skipMatch: "Spiel überspringen",
      spectateMatch: "Spiel beobachten"
    },

    newGameView: {
      title: "Neues Spiel",
      enterNickname: "Gib für jeden Spieler einen Spitznamen ein.",
      selectPlayer: "Wähle, welcher Spieler von {{username}} gesteuert wird.",
      aiOption: "Optional: KI aktivieren, um den anderen Spieler zu steuern.",
      startGame: "Spiel starten"
    },

    newTournamentView: {
      confirmAbortTournament: "Möchtest du das Turnier wirklich abbrechen?",
      enterTournamentName: "Gib den Turniernamen ein",
      selectNumberPlayers: "Wähle die Anzahl der Spieler",
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
      playerChoice: "{{username}} spielt als Spieler {{i}}",
      playerNickname: "Spitzname von Spieler {{i}}",
      aiPlayer: "KI-Spieler",
      aiStrength: "KI-Stärke",
      aiStrengthEasy: "Leicht",
      aiStrengthMedium: "Mittel",
      aiStrengthHard: "Schwer"
    },

    playerNicknamesView: {
      enterPlayerNicknames: "Gib die Spitznamen der Spieler ein",
      title: "Spieler-Spitznamen",
      aiOptions:
        "Optional: KI aktivieren, um einen oder mehrere Spieler steuern zu lassen.",
      submitNicknames: "Spitznamen bestätigen"
    },

    profileView: {
      cannotChangeEmailOrPW:
        "Du kannst deine E-Mail-Adresse oder dein Passwort nicht ändern.",
      changeAvatar: "Ändere deinen Avatar.",
      changePasswordButton: "Passwort ändern",
      changePassword: "Ändere dein Passwort.",
      chooseFile: "Wähle ein Bild für deinen Avatar",
      currentPassword: "Aktuelles Passwort",
      newPassword: "Neues Passwort",
      noFileSelected: "Keine Datei ausgewählt",
      saveChanges: "Änderungen speichern",
      signedInWithGoogle: "Mit Google angemeldet",
      updateProfile: "Aktualisiere dein Profil.",
      uploadYourAvatar: "Lade deinen Avatar hoch",
      title: "Dein Profil"
    },

    registerView: {
      register: "Registrieren",
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
      title: "Einstellungen",
      settings: "Lege hier deine Einstellungen und Präferenzen fest.",
      preferredLanguage: "Wähle dein bevorzugte Sprache aus.",
      saveLanguage: "Sprache speichern",
      displayTwoFASetup: "2FA Einstellungen anzeigen",
      deactivateTwoFASetup: "2FA deaktivieren",
      editTwoFASetup: "2‑Faktor-Authentifizierung (2FA) bearbeiten",
      twoFASetup: "2FA Einstellungen",
      twoFAInfo: [
        "Aktiviere 2FA:",
        "",
        "Bitte verwende eine Authentifizierungs App",
        "um den QR-Code unten zu scannen."
      ],
      twoFAActivated: ["2FA aktiviert"],
      twoFABackupCode: "2FA Backup-Code",
      enterTwoFACode: "Gib den 2FA-Code ein:",
      activateTwoFA: "Aktivieren",
      deactivateTwoFA: "Deaktivieren",
      twoFAGenerateBackupCodes: "Backup-Codes generieren",
      confirmPassword: "Bestätigen",
      twoFABackupCodeInfo: [
        "Das sind deine Backup-Codes.",
        "Kopiere diese oder lade sie herunter",
        "",
        "Sie werden nicht nochmal angezeigt"
      ],
      twoFADownloadBackupCodes: "Herunterladen"
    },

    statsView: {
      dashboard: "Übersicht",
      date: "Datum",
      details: "Details",
      eliminatedInRound: "Ausgeschieden in Runde {{round}}",
      friends: "Freunde",
      friendOnly:
        "Du musst befreundet sein, um detaillierte Statistiken zu sehen.",
      joined: "Beigetreten am {{date}}",
      matches: "Spiele",
      matchHistory: "Spielverlauf",
      played: "Gespielt",
      player1: "Spieler 1",
      player2: "Spieler 2",
      player1Score: "Spieler 1 Punkte",
      player2Score: "Spieler 2 Punkte",
      result: "Ergebnis",
      title: "Statistiken",
      tournament: "Turnier",
      tournaments: "Turniere",
      usedNickname: "Verwendeter Spitzname",
      winRate: "Siegquote",
      winstreakCur: "Siegesserie",
      winstreakMax: "Max-Serie"
    },

    toast: {
      acceptedFriendRequest: "Freundschaftsanfrage angenommen von ",
      avatarUploadFailed:
        "Avatar konnte nicht hochgeladen werden. Bitte versuche es erneut.",
      avatarUploadedSuccess: "Avatar erfolgreich hochgeladen!",
      chartCannotRemoveYourself: "Du kannst dich selbst nicht entfernen.",
      chartCompareMaxThree: "Du kannst höchstens 3 Freunde vergleichen.",
      chartError: "Ein Diagramm konnte nicht initialisiert werden",
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
      friendRequestEventError: "Fehler beim Empfang der Freundschaftsanfrage.",
      friendRequestSendError: "Fehler beim Senden der Freundschaftsanfrage.",
      emailExists: "Diese E-Mail-Adresse ist bereits registriert",
      emailOrUsernameExists: "E-Mail oder Benutzername existiert bereits",
      invalidUsernameOrPW: "Ungültiger Benutzername oder Passwort",
      invalidToken: "Token nicht valide",
      logoutError: "Fehler beim Abmelden. Bitte versuche es erneut.",
      passwordUpdateFailed:
        "Passwort konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      passwordUpdatedSuccess: "Passwort erfolgreich aktualisiert!",
      tabError: "Der Tab konnte nicht initialisiert werden.",
      twoFASetupSuccess: "2FA erfolgreich aktiviert!",
      twoFARemoveSuccess: "2FA erfolgreich deaktiviert!",
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
    },

    chart: {
      activity: "Aktivität",
      current: "Aktuell",
      loss: "Niederlage",
      numPlayers: "{{num}} Spieler",
      played: "Gespielte Turniere{{range}}",
      progress: "Fortschritt ({{num}} Spieler)",
      progression: "Siegquote{{range}}",
      rangeLastDays: " (Letzten {{count}} Tage)",
      rangeLastMatches: " (Letzten {{count}} Spiele)",
      reachedThisStage: "Diese Stufe erreicht",
      scoreDiff: "Punktedifferenz{{range}}",
      scores: "Punkte{{range}}",
      selectUpTo: "Wähle bis zu 3 Freunde aus",
      summary: "Übersicht",
      win: "Sieg",
      winLoss: "Siege vs Niederlagen{{range}}"
    }
  }
};

export default de;
