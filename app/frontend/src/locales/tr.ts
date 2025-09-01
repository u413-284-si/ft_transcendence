import { TranslationShape } from "./en.js";

const tr: TranslationShape = {
  translation: {
    error: {
      invalidDynamicRoutePattern: "Invalid dynamic route pattern: {{pattern}}",
      matchNotFound: "Session data not found.",
      missingRequestID: "Request ID is missing.",
      nextMatchNotFound: "Next session data missing.",
      noActiveToken: "No active token detected.",
      nullMatches: "No session logs detected.",
      requestNotFound: "Request with ID {{id}} not found.",
      somethingWentWrong: "System malfunction.",
      tournamentIDNotFound: "Tournament ID missing.",
      undefinedMatch: "Session undefined",
      unexpected: "⚠️ Unexpected system anomaly detected.",
      unknownRequestListType: "Unrecognized signal type: {{type}}",
      userNotFound: "User node not found.",
      userStatsNotFound: "Node performance data unavailable.",
      validateUser: "Error verifying user:<br>Redirecting to logon node."
    },

    errorView: {
      details: "⚡ Data Stream: {{cause}}",
      errorStatus: "🚨 ERROR CODE {{status}}",
      title: "SYSTEM ERROR",
      reload: "REBOOT"
    },

    friendListItem: {
      accept: "Authorize",
      decline: "Reject",
      delete: "Erase",
      pending: "Awaiting",
      remove: "Disconnect"
    },

    friendsView: {
      addFriend: "Initiate link",
      confirmDeclineRequest: "Confirm disconnection of incoming signal?",
      confirmDeleteRequest: "Confirm deletion of this data packet?",
      confirmRemoveFriend: "Confirm removal of network node?",
      exactUsername: "Exact user ID",
      friendRequests: "Incoming link requests",
      title: "Network Nodes",
      incomingRequests: "Incoming link signals",
      noFriends: "Network isolated: no connections found",
      noIncoming: "No incoming link signals detected",
      noOutgoing: "No outgoing link signals detected",
      outgoingRequests: "Outgoing link requests",
      sendFriendRequest: "Transmit link request",
      yourFriends: "Active connections"
    },

    gameView: {
      title: "ACTIVE SESSION"
    },

    global: {
      avatar: "USER AVATAR",
      submit: "Transmit",
      confirmNewPassword: "Confirm new access code",
      continue: "Press [ENTER] to proceed",
      editProfile: "Modify your data matrix",
      email: "Data address",
      label: "{{field}}:",
      logout: "Log off",
      lost: "Disconnected",
      match: "Session {{matchId}}",
      offline: "Offline",
      online: "Online",
      password: "Access code",
      twoFACode: "Cipher code",
      pongGame: "PONG GRID",
      player: "Operative",
      playerWins: "Operative {{player}} victorious",
      round: "Cycle {{round}}",
      toBeDefined: "To be configured",
      tournament: "TOURNAMENT: <strong>{{tournamentName}}</strong>",
      username: "User ID",
      userNotFound: "User node not found.",
      welcome: "WELCOME",
      winnerMatch: "Winning session {{matchId}}",
      won: "VICTORY"
    },

    homeView: {
      helloUser:
        "⚡ Greetings, User {{username}}!<br />Entering the Mainframe Hub",
      title: "MAINFRAME"
    },

    invalid: {
      emailEmpty: "Data address field cannot be empty.",
      emailFormat: "Data address format corrupted.",
      emailOrUsernameEmpty: "Enter valid user ID or data address.",
      emailOrUsernameFormat: "User ID or data address format invalid.",
      fillAtLeastOneField: "Fill at least one data field.",
      fillInUsername: "User ID required.",
      friendNotSelf: "Self-linking not permitted.",
      friendRequestAlreadySent: "Link request already transmitted.",
      friendsAlready: "Node already connected.",
      imageFileEmpty: "Select an image file for upload.",
      imageFileFormat: "Upload a valid image data file.",
      nicknameEmpty: "Node alias cannot be empty.",
      nicknameFormat:
        "Node alias must be 3-20 characters, letters, digits, or -!?_$.",
      nicknameUniqueness: "Node alias must be unique.",
      passwordEmpty: "Access code cannot be empty.",
      passwordFormat:
        "Access code must be 10-64 chars, include digit, uppercase, lowercase, and special char @$!%*?&",
      passwordConfirmationEmpty: "Re-enter your access code",
      passwordConfirmation: "Access code confirmation mismatch.",
      twoFACode: "Cipher code invalid.",
      twoFACodeEmpty: "Cipher code field cannot be void.",
      twoFACodeFormat: "Cipher code must be a 6-digit number.",
      twoFABackupCode: "Backup cipher invalid.",
      twoFABackupCodeEmpty: "Backup cipher field cannot be void.",
      twoFABackupCodeFormat: "Backup cipher must be an 8-digit sequence.",
      playerSelection: "Select number of operatives.",
      tournamentNameEmpty: "Tournament ID cannot be empty.",
      tournamentNameFormat:
        "Tournament ID must be 3-20 chars, letters, digits, or -!?_$.",
      tournamentNameUniqueness: "Tournament ID must be unique.",
      usernameEmpty: "User ID cannot be empty.",
      usernameFormat: "User ID must be 3-20 chars, letters, digits, or -!?_$.",
      usernameUniqueness: "User ID must be unique."
    },

    loginView: {
      title: "ACCESS NODE",
      usernameOrEmail: "User ID or Data Address"
    },

    twoFAVerifyView: {
      title: "Cipher code verification",
      enterTwoFACode: "Input cipher code:",
      useBackupCode: "Deploy backup cipher"
    },

    twoFABackupCodeVerifyView: {
      title: "Backup cipher verification",
      twoFABackupCode: "Backup cipher",
      enterTwoFABackupCode: "Input backup cipher:"
    },

    matchAnnouncementView: {
      abortTournament: "TERMINATE TOURNAMENT",
      nextMatch: "Next session queued:",
      title: "UPCOMING SESSION",
      roundMatch: "Cycle {{round}} - Session {{match}}",
      startMatch: "INITIATE SESSION",
      tournamentStatus: "TOURNAMENT STATUS"
    },

    newGameView: {
      title: "NEW SESSION",
      selectPlayer: "Assign control to operative {{username}}",
      startGame: "BEGIN SESSION"
    },

    newTournamentView: {
      confirmAbortTournament: "Confirm cancellation of tournament sequence?",
      enterTournamentName: "Input tournament designation",
      newTournamentDescription:
        "Set tournament designation and assign operative count",
      title: "NEW TOURNAMENT SEQUENCE",
      numberOfPlayers: "Operatives count",
      players4: "4 operatives",
      players8: "8 operatives",
      players16: "16 operatives",
      startTournament: "LAUNCH TOURNAMENT",
      tournamentName: "Tournament designation"
    },

    nicknameInput: {
      enterYourNickname: "Enter your operative alias",
      playerChoice: "Operating as agent {{i}}",
      playerNickname: "Agent {{i}} alias"
    },

    playerNicknamesView: {
      enterPlayerNicknames: "Input operative aliases",
      title: "OPERATIVE ALIASES",
      selectControlledPlayer: "Select operative controlled by {{username}}",
      submitNicknames: "TRANSMIT ALIASES"
    },

    profileView: {
      cannotChangeEmailOrPW:
        "Data address and access code alterations are locked.",
      changeAvatar: "Override avatar below.",
      changePasswordButton: "MODIFY ACCESS CODE",
      changePassword: "Update your access code below.",
      chooseFile: "Select image file for avatar override",
      currentPassword: "Current Access Code",
      newPassword: "New Access Code",
      noFileSelected: "No file detected",
      saveChanges: "COMMIT CHANGES",
      signedInWithGoogle: "Connected via Google Network",
      updateProfile: "Update your profile matrix below.",
      uploadYourAvatar: "Upload your avatar data",
      title: "USER PROFILE"
    },

    registerView: {
      register: "Register access node",
      title: "NODE REGISTRATION"
    },

    resultsView: {
      bracket: "Tournament Grid",
      champion: "Gridmaster",
      congratulations: "System congrats: Victory achieved!",
      finish: "Seal Session",
      title: "RESULTS LOG",
      tournamentResults: "Tournament Outcome Grid"
    },

    settingsView: {
      title: "System Settings",
      settings: "Configure your system parameters.",
      preferredLanguage: "Select interface language protocol.",
      saveLanguage: "Save language preference",
      displayTwoFASetup: "Display cipher configuration",
      deactivateTwoFASetup: "Deactivate cipher configuration",
      editTwoFASetup: "Edit your cipher configuration",
      twoFASetup: "Cipher Configuration",
      twoFAInfo: [
        "Activate Cipher:",
        "",
        "Use an Authenticator App",
        "to scan the QR code below."
      ],
      twoFAActivated: ["Cipher Active"],
      twoFABackupCode: "Backup cipher code",
      enterTwoFACode: "Input cipher code:",
      activateTwoFA: "Activate",
      deactivateTwoFA: "Deactivate",
      twoFAGenerateBackupCodes: "Generate backup cipher codes",
      confirmPassword: "Confirm Access Code",
      twoFABackupCodeInfo: [
        "These are your backup cipher codes.",
        "Copy or download them securely.",
        "",
        "They won’t be shown again."
      ],
      twoFADownloadBackupCodes: "Download"
    },

    statsView: {
      dashboard: "Core",
      date: "Cycle Date",
      details: "Data",
      eliminatedInRound: "User derezzed in cycle {{round}}",
      friendOnly: "Link established required to access complete logs.",
      friends: "Connections",
      joined: "Node integrated: {{date}}",
      matches: "Sessions",
      matchHistory: "Session Log",
      played: "Engaged",
      player1: "Agent 1",
      player2: "Agent 2",
      player1Score: "Agent 1 Score",
      player2Score: "Agent 2 Score",
      result: "Session Outcome",
      title: "Performance Stats",
      tournament: "Tournament Grid",
      tournaments: "Tournaments",
      usedNickname: "Node alias",
      winRate: "Victory Ratio",
      winstreakCur: "Sequence",
      winstreakMax: "Max Sequence"
    },

    toast: {
      acceptedFriendRequest: "Link request accepted by ",
      avatarUploadFailed: "Avatar upload interrupted. Reattempt required.",
      avatarUploadedSuccess: "Avatar successfully embedded!",
      chartCannotRemoveYourself: "Self-removal not permitted.",
      chartCompareMaxThree: "Data limit: 3 nodes.",
      chartError: "Chart failed to initialize",
      connectionLost:
        "Signal lost — attempting reconnection in {{delay}} cycles... (Attempt {{attempt}} of {{maxAttempts}})",
      connectionReestablished: "Signal reestablished",
      connectionUnavailable:
        "Reconnection failed. System halted until manual reboot.",
      declinedFriendRequest: "Link request declined by ",
      deletedFriendRequest: "Link request deleted by ",
      emailExists: "Data address already exists in network",
      emailOrUsernameExists: "Data address or User ID already exists",
      friendAdded: "Link established with {{username}}!",
      friendRequestButtonError: "Error processing link request",
      friendRequestSendError: "Error transmitting link request.",
      invalidUsernameOrPW: "Invalid User ID or access code",
      logoutError: "Logout failed. Reattempt required.",
      passwordUpdateFailed: "Access code update failed. Retry advised.",
      passwordUpdatedSuccess: "Access code updated successfully!",
      twoFASetupSuccess: "Cipher activated successfully!",
      twoFARemoveSuccess: "Cipher deactivated successfully!",
      profileUpdateFailed: "Profile update failed. Retry advised.",
      profileUpdatedSuccess: "Profile updated successfully!",
      registrationSuccess:
        "Access node registration successful for {{username}}!",
      sendSuccess: "Link request successfully transmitted to {{username}}",
      terminatedFriendship: "Connection terminated with ",
      tokenRefreshFailed: "Token refresh failed. Reattempt required.",
      userAcceptedFriendRequest:
        "Link request from <strong>{{username}}</strong> accepted",
      userDeclinedFriendRequest:
        "Link request from <strong>{{username}}</strong> rejected",
      userRescindedFriendRequest:
        "Link request from <strong>{{username}}</strong> withdrawn",
      userRemovedFriend:
        "<strong>{{username}}</strong> disconnected from network",
      userSentFriendRequest: "Link request from <strong>{{username}}</strong>",
      userStatus: "{{username}} status: {{status}}",
      userVerificationError:
        "An error occurred while verifying the user:<br>Redirecting to login.",
      validateTournamentNameError: "Error verifying tournament ID."
    },

    chart: {
      activity: "Log",
      current: "Active",
      loss: "Loss",
      numPlayers: "({{num}}) Operatives",
      played: "Tournament Log{{range}}",
      progress: "Progress {{num}}%",
      progression: "Winrate Change{{range}}",
      rangeLastDays: " (Last {{count}} Days)",
      rangeLastMatches: " (Last {{count}} Matches)",
      reachedThisStage: "Stage Reached",
      scoreDiff: "Score Change{{range}}",
      scores: "Score Log{{range}}",
      selectUpTo: "Select ≤ 3 nodes",
      summary: "System Summary",
      win: "Win",
      winLoss: "Win/Loss Log{{range}}"
    }
  }
};

export default tr;
