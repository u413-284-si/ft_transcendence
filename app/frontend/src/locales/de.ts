import { TranslationShape } from "./en.js";

const de: TranslationShape = {
  translation: {
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
    },

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
      reload: "Neu laden",
      title: "Fehler"
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
      incomingRequests: "Eingehende Anfragen",
      noFriends: "Du hast noch keine Freunde",
      noIncoming: "Keine eingehenden Anfragen",
      noOutgoing: "Keine ausgehenden Anfragen",
      outgoingRequests: "Ausgehende Anfragen",
      sendFriendRequest: "Freundschaftsanfrage senden",
      title: "Freunde",
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
      matchWinner: "Spiel {{matchId}} Sieger",
      offline: "Offline",
      online: "Online",
      password: "Passwort",
      player: "Spieler",
      playerWins: "{{player}} gewinnt",
      pongGame: "Pong-Spiel",
      round: "Runde {{round}}",
      submit: "Bestätigen",
      toBeDefined: "Noch nicht definiert",
      tournament: "Turnier: <strong>{{tournamentName}}</strong>",
      twoFACode: "2FA-Code",
      username: "Benutzername",
      userNotFound: "Benutzer nicht gefunden.",
      welcome: "Willkommen",
      won: "Gewonnen"
    },

    homeView: {
      faqControlsLeftPaddle: "Linken Schläger bewegen: W / S",
      faqControlsRightPaddle: "Rechten Schläger bewegen: Pfeiltasten ↑ ↓",
      faqControlsTitle: "Steuerung",

      faqExtrasText:
        "Pong ist eines der ersten Videospiele überhaupt: einfach, zeitlos und süchtig machend. Inspiriert vom Blockbuster TRON, wird hier der Klassiker in einem neonbeleuchteten Stil neu interpretiert.",
      faqExtrasTitle: "Hintergrundinfos",
      faqGameModesSingle:
        "Einzelspiel: Ein schnelles Match gegen die KI oder einen Freund.",
      faqGameModesTitle: "Spielmodi",

      faqGameModesTournament:
        "Turnier: Spiele mehrere Runden, bis ein Champion übrig bleibt.",
      faqTips1:
        "Antizipiere den Pfad des Balls voraus, statt ihm hinterherzulaufen.",
      faqTips2:
        "Treffe den Ball mit den Kanten des Schlägers, um den Winkel zu verändern.",

      faqTips3:
        "Sei vorsichtig! Jeder Schlägerkontakt erhöht die Geschwindigkeit des Balls.",
      faqTipsTitle: "Tipps",
      faqTitle: "FAQ",
      helloUser: "Hallo {{username}}!",

      tagline: "Enter the Grid. Master the Pong.",
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
      passwordConfirmation: "Passwörter stimmen nicht überein.",
      passwordConfirmationEmpty: "Bitte wiederhole dein Passwort",
      passwordEmpty: "Passwort darf nicht leer sein.",
      passwordFormat:
        "Passwort muss 10 bis 64 Zeichen enthalten und mindestens eine Zahl, einen Groß- und Kleinbuchstaben sowie ein Sonderzeichen: @$!%*?&",
      playerSelection: "Bitte Anzahl der Spieler auswählen.",
      tournamentNameEmpty: "Turniername darf nicht leer sein.",
      tournamentNameFormat:
        "Turniername muss 3 bis 20 Zeichen enthalten und darf Buchstaben, Zahlen oder folgende Sonderzeichen enthalten: -!?_$.",
      tournamentNameUniqueness: "Turniername muss eindeutig sein.",
      twoFABackupCode: "Backup-Code ist falsch.",
      twoFABackupCodeEmpty: "Backup-Code darf nicht leer sein.",
      twoFABackupCodeFormat: "Backup-Code muss eine achtstellige Zahl sein.",
      twoFACode: "2FA-Code ist falsch.",
      twoFACodeEmpty: "2FA-Code darf nicht leer sein.",
      twoFACodeFormat: "2FA-Code muss eine sechsstellige Zahl sein.",
      usernameEmpty: "Benutzername darf nicht leer sein.",
      usernameFormat:
        "Benutzername muss 3 bis 20 Zeichen enthalten und darf Buchstaben, Zahlen oder folgende Sonderzeichen enthalten: -!?_$.",
      usernameUniqueness: "Benutzername muss eindeutig sein."
    },

    loginView: {
      title: "Anmelden",
      usernameOrEmail: "Nutzername oder Mail-Adresse"
    },

    matchAnnouncementView: {
      abortTournament: "Turnier abbrechen",
      nextMatch: "Nächstes Spiel",
      roundMatch: "Runde {{round}} - Spiel {{match}}",
      skipMatch: "Spiel überspringen",
      spectateMatch: "Spiel beobachten",
      startMatch: "Spiel starten",
      title: "Nächstes Spiel!"
    },

    newGameView: {
      aiOption: "Optional: KI aktivieren, um den anderen Spieler zu steuern.",
      enterNickname: "Gib für jeden Spieler einen Spitznamen ein.",
      selectPlayer: "Wähle, welcher Spieler von {{username}} gesteuert wird.",
      startGame: "Spiel starten",
      title: "Neues Spiel"
    },

    newTournamentView: {
      confirmAbortTournament: "Möchtest du das Turnier wirklich abbrechen?",
      enterTournamentName: "Gib den Turniernamen ein",
      numberOfPlayers: "Anzahl der Spieler",
      players16: "16 Spieler",
      players4: "4 Spieler",
      players8: "8 Spieler",
      selectNumberPlayers: "Wähle die Anzahl der Spieler",
      startTournament: "Turnier starten",
      title: "Neues Turnier",
      tournamentName: "Turniername"
    },

    nicknameInput: {
      aiPlayer: "KI-Spieler",
      aiStrength: "KI-Stärke",
      aiStrengthEasy: "Leicht",
      aiStrengthHard: "Schwer",
      aiStrengthMedium: "Mittel",
      enterYourNickname: "Gib deinen Spitznamen ein",
      playerChoice: "{{username}} spielt als Spieler {{i}}",
      playerNickname: "Spitzname von Spieler {{i}}"
    },

    playerNicknamesView: {
      aiOptions:
        "Optional: KI aktivieren, um einen oder mehrere Spieler steuern zu lassen.",
      enterPlayerNicknames: "Gib die Spitznamen der Spieler ein",
      submitNicknames: "Spitznamen bestätigen",
      title: "Spieler-Spitznamen"
    },

    profileView: {
      cannotChangeEmailOrPW:
        "Du kannst deine E-Mail-Adresse oder dein Passwort nicht ändern.",
      changeAvatar: "Ändere deinen Avatar.",
      changePassword: "Ändere dein Passwort.",
      changePasswordButton: "Passwort ändern",
      chooseFile: "Wähle ein Bild für deinen Avatar",
      currentPassword: "Aktuelles Passwort",
      deleteAvatar: "Lösche deinen Avatar",
      deleteAvatarConfirm: "Möchtest du deinen Avatar wirklich löschen?",
      newPassword: "Neues Passwort",
      noFileSelected: "Keine Datei ausgewählt",
      saveChanges: "Änderungen speichern",
      signedInWithGoogle: "Mit Google angemeldet",
      title: "Dein Profil",
      updateProfile: "Aktualisiere dein Profil.",
      uploadYourAvatar: "Lade deinen Avatar hoch"
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
      activateTwoFA: "Aktivieren",
      confirmPassword: "Bestätigen",
      dangerZone: "Gefahrenbereich",
      deactivateTwoFA: "Deaktivieren",
      deactivateTwoFASetup: "2FA deaktivieren",
      deleteProfile: "Lösche dein Profil",
      deleteProfileConfirm: "Möchtest du dein Profile wirklich löschen?",
      displayTwoFASetup: "2FA Einstellungen anzeigen",
      editTwoFASetup: "2‑Faktor-Authentifizierung (2FA) bearbeiten",
      enterTwoFACode: "Gib den 2FA-Code ein:",
      preferredLanguage: "Wähle dein bevorzugte Sprache aus.",
      saveLanguage: "Sprache speichern",
      settings: "Lege hier deine Einstellungen und Präferenzen fest.",
      title: "Einstellungen",
      twoFAActivated: ["2FA aktiviert"],
      twoFABackupCode: "2FA Backup-Code",
      twoFABackupCodeInfo: [
        "Das sind deine Backup-Codes.",
        "Kopiere diese oder lade sie herunter",
        "",
        "Sie werden nicht nochmal angezeigt"
      ],
      twoFADownloadBackupCodes: "Herunterladen",
      twoFAGenerateBackupCodes: "Backup-Codes generieren",
      twoFAInfo: [
        "Aktiviere 2FA:",
        "",
        "Bitte verwende eine Authentifizierungs App",
        "um den QR-Code unten zu scannen."
      ],
      twoFASetup: "2FA Einstellungen"
    },

    statsView: {
      dashboard: "Übersicht",
      date: "Datum",
      details: "Details",
      eliminatedInRound: "Ausgeschieden in Runde {{round}}",
      friendOnly:
        "Du musst befreundet sein, um detaillierte Statistiken zu sehen.",
      friends: "Freunde",
      joined: "Beigetreten am {{date}}",
      matches: "Spiele",
      matchHistory: "Spielverlauf",
      played: "Gespielt",
      player1: "Spieler 1",
      player1Score: "Spieler 1 Punkte",
      player2: "Spieler 2",
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
      avatarDeleteFailed:
        "Avatar konnte nicht gelöscht werden. Bitte versuche es erneut.",
      avatarDeleteSuccess: "Avatar erfolgreich gelöscht!",
      avatarUploadedSuccess: "Avatar erfolgreich hochgeladen!",
      avatarUploadFailed:
        "Avatar konnte nicht hochgeladen werden. Bitte versuche es erneut.",
      chartCannotRemoveYourself: "Du kannst dich selbst nicht entfernen.",
      chartCompareMaxThree: "Du kannst höchstens 3 Freunde vergleichen.",
      chartError: "Ein Diagramm konnte nicht initialisiert werden",
      connectionLost:
        "Verbindung verloren - erneuter Versuch in {{delay}} Sekunden... (Versuch {{attempt}} von {{maxAttempts}})",
      connectionReestablished: "Verbindung wiederhergestellt",
      connectionUnavailable:
        "Verbindung nicht wiederherstellbar. Versuche gestoppt bis Seite neu geladen wird.",
      emailExists: "Diese E-Mail-Adresse ist bereits registriert",
      emailExistsWithGoogle:
        "E-Mail wird bereits mit Google verwendet. Bitte melde dich über Google an.",
      emailOrUsernameExists: "E-Mail oder Benutzername existiert bereits",
      emailOrUsernameNotExist: "E-Mail oder Benutzername gibt es nicht",
      friendAcceptedFriendRequest:
        "<strong>{{username}}</strong> hat deine Anfrage angenommen",
      friendAdded: "Freund <strong>{{username}}</strong> hinzugefügt",
      friendDeclinedFriendRequest:
        "<strong>{{username}}</strong> hat deine Anfrage abgelehnt",
      friendRemovedFriend:
        "<strong>{{username}}</strong> möchte nicht mehr dein Freund sein",
      friendRequestButtonError:
        "Fehler beim Verarbeiten der Freundschaftsanfrage",
      friendRequestEventError: "Fehler beim Empfang der Freundschaftsanfrage.",
      friendRescindedFriendRequest:
        "<strong>{{username}}</strong> hat seine Anfrage zurückgezogen",
      friendSentFriendRequest:
        "<strong>{{username}}</strong> hat dir eine Freundschaftsanfrage gesendet",
      invalidToken: "Token nicht valide",
      invalidUsernameOrPW: "Ungültiger Benutzername oder Passwort",
      loginError: "Fehler beim Anmelden. Bitte versuche es erneut",
      logoutError: "Fehler beim Abmelden. Bitte versuche es erneut.",
      passwordUpdatedSuccess: "Passwort erfolgreich aktualisiert!",
      passwordUpdateFailed:
        "Passwort konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      profileDeleteFailed:
        "Profil konnte nicht gelöscht werden. Bitte versuche es erneut.",
      profileDeleteSuccess: "Profil erfolgreich gelöscht!",
      profileUpdatedSuccess: "Profil erfolgreich aktualisiert!",
      profileUpdateFailed:
        "Profil konnte nicht aktualisiert werden. Bitte versuche es erneut.",
      registrationSuccess: "Registrierung von {{username}} erfolgreich!",
      somethingWentWrong: "Etwas ist schief gelaufen",
      tabError: "Der Tab konnte nicht initialisiert werden.",
      tokenRefreshFailed:
        "Token-Aktualisierung fehlgeschlagen. Bitte erneut versuchen.",
      tournamentAbortFailed:
        "Turnier konnte nicht abgebrochen werden. Bitte versuche es erneut.",
      tournamentAbortSuccess: "Tunier erfolgreich abgebrochen",
      tournamentFinishFailed:
        "Turnier konnte nicht beendet werden. Bitte versuche es erneut.",
      tournamentFinishSuccess: "Tunier erfolgreich beendet!",
      twoFARemoveSuccess: "2FA erfolgreich deaktiviert!",
      twoFASetupSuccess: "2FA erfolgreich aktiviert!",
      userAcceptedFriendRequest: "Angenommen - Freundschafsanfrage von ",
      userDeclinedFriendRequest: "Abgelehnt - Freundschaftsanfrage von ",
      userRemovedFriendship: "Freundschaft beendet mit ",
      userRescindedFriendRequest: "Zurückgezogen - Freundschaftsanfrage von ",
      userSendFriendRequestSuccess:
        "Anfrage erfolgreich an <strong>{{username}}</strong> gesendet",
      userSendRequestFailed: "Fehler beim Senden der Freundschaftsanfrage.",
      userStatus: "<strong>{{username}}</strong> ist {{status}}",
      userVerificationError:
        "Fehler bei der Benutzerverifizierung:<br>Weiterleitung zur Anmeldung.",
      validateTournamentNameError:
        "Fehler bei der Validierung des Turniernamens."
    },

    twoFABackupCodeVerifyView: {
      enterTwoFABackupCode: "Gib den Backup-Code ein:",
      title: "Backup-Code Verifizierung",
      twoFABackupCode: "Backup-Code"
    },

    twoFAVerifyView: {
      enterTwoFACode: "Gib den 2FA-Code ein:",
      title: "2FA-Code Verifizierung",
      useBackupCode: "Backup-Code verwenden"
    }
  }
};

export default de;
