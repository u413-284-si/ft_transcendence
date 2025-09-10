import { TranslationShape } from "./en.js";

const tr: TranslationShape = {
  translation: {
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
    },

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
      reload: "REBOOT",
      title: "SYSTEM ERROR"
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
      incomingRequests: "Incoming link signals",
      noFriends: "Network isolated: no connections found",
      noIncoming: "No incoming link signals detected",
      noOutgoing: "No outgoing link signals detected",
      outgoingRequests: "Outgoing link requests",
      sendFriendRequest: "Transmit link request",
      title: "Network Nodes",
      yourFriends: "Active connections"
    },

    gameView: {
      title: "ACTIVE SESSION"
    },

    global: {
      avatar: "USER AVATAR",
      confirmNewPassword: "Confirm new access code",
      continue: "Press [ENTER] to proceed",
      editProfile: "Modify your data matrix",
      email: "Data address",
      label: "{{field}}:",
      logout: "Log off",
      lost: "Disconnected",
      match: "Session {{matchId}}",
      matchWinner: "Session {{matchId}} survivor",
      offline: "Offline",
      online: "Online",
      password: "Access code",
      player: "Operative",
      playerWins: "Operative {{player}} victorious",
      pongGame: "PONG GRID",
      round: "Cycle {{round}}",
      submit: "Transmit",
      toBeDefined: "To be configured",
      tournament: "TOURNAMENT: <strong>{{tournamentName}}</strong>",
      twoFACode: "Cipher code",
      username: "User ID",
      userNotFound: "User node not found.",
      welcome: "WELCOME",
      won: "VICTORY"
    },

    homeView: {
      faqControlsLeftPaddle: "Move left paddle: W / S",
      faqControlsRightPaddle: "Move right paddle: Arrow Keys ↑ ↓",
      faqControlsTitle: "CONTROLS",

      faqExtrasText:
        "Pong is a retro digital construct: timeless, addictive, and inspired by TRON's neon grid. Engage in the neon battle of wits.",
      faqExtrasTitle: "BACKGROUND DATA",
      faqGameModesSingle:
        "Single Session: Quick match vs AI or another operative.",
      faqGameModesTitle: "OPERATIVE MODES",

      faqGameModesTournament:
        "Tournament: Compete in multiple cycles until one master node remains.",
      faqTips1: "Predict the balls trajectory instead of chasing it.",
      faqTips2: "Use paddle edges to alter the ball trajectory.",

      faqTips3: "⚠️ Caution! Each paddle hit accelerates the ball.",
      faqTipsTitle: "TACTICAL ADVICE",
      faqTitle: "SYSTEM MANUAL",
      helloUser: "⚡ Greetings, User {{username}}!",

      tagline: "Enter the Grid. Master the Pong.",
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
      passwordConfirmation: "Access code confirmation mismatch.",
      passwordConfirmationEmpty: "Re-enter your access code",
      passwordEmpty: "Access code cannot be empty.",
      passwordFormat:
        "Access code must be 10-64 chars, include digit, uppercase, lowercase, and special char @$!%*?&",
      playerSelection: "Select number of operatives.",
      tournamentNameEmpty: "Tournament ID cannot be empty.",
      tournamentNameFormat:
        "Tournament ID must be 3-20 chars, letters, digits, or -!?_$.",
      tournamentNameUniqueness: "Tournament ID must be unique.",
      twoFABackupCode: "Backup cipher invalid.",
      twoFABackupCodeEmpty: "Backup cipher field cannot be void.",
      twoFABackupCodeFormat: "Backup cipher must be an 8-digit sequence.",
      twoFACode: "Cipher code invalid.",
      twoFACodeEmpty: "Cipher code field cannot be void.",
      twoFACodeFormat: "Cipher code must be a 6-digit number.",
      usernameEmpty: "User ID cannot be empty.",
      usernameFormat: "User ID must be 3-20 chars, letters, digits, or -!?_$.",
      usernameUniqueness: "User ID must be unique."
    },

    loginView: {
      title: "ACCESS NODE",
      usernameOrEmail: "User ID or Data Address"
    },

    matchAnnouncementView: {
      abortTournament: "Terminate tournament",
      nextMatch: "Next session queued",
      roundMatch: "Cycle {{round}} - Session {{match}}",
      skipMatch: "Bypass session",
      spectateMatch: "Monitor session",
      startMatch: "Initiate session",
      title: "UPCOMING SESSION"
    },

    newGameView: {
      aiOption: "Optional: let the system AI control the other node.",
      enterNickname: "Enter your operative alias code.",
      selectPlayer: "Assign control to operative {{username}}.",
      startGame: "BEGIN SESSION",
      title: "NEW SESSION"
    },

    newTournamentView: {
      confirmAbortTournament: "Confirm cancellation of tournament sequence?",
      enterTournamentName: "Input tournament designation",
      numberOfPlayers: "Operatives count",
      players16: "16 operatives",
      players4: "4 operatives",
      players8: "8 operatives",
      selectNumberPlayers: "Assign operative count",
      startTournament: "LAUNCH TOURNAMENT",
      title: "NEW TOURNAMENT SEQUENCE",
      tournamentName: "Tournament designation"
    },

    nicknameInput: {
      aiPlayer: "Synthetic Operative",
      aiStrength: "Processing Power",
      aiStrengthEasy: "Low Protocol",
      aiStrengthHard: "Overclocked Protocol",
      aiStrengthMedium: "Standard Protocol",
      enterYourNickname: "Enter your operative alias",
      playerChoice: "{{username}} operates as agent {{i}}",
      playerNickname: "Agent {{i}} alias"
    },

    playerNicknamesView: {
      aiOptions: "Optional: let the system AI control one or multiple nodes.",
      enterPlayerNicknames: "Input operative aliases",
      submitNicknames: "TRANSMIT ALIASES",
      title: "OPERATIVE ALIASES"
    },

    profileView: {
      cannotChangeEmailOrPW:
        "Data address and access code alterations are locked.",
      changeAvatar: "Override avatar.",
      changePassword: "Update your access code.",
      changePasswordButton: "MODIFY ACCESS CODE",
      chooseFile: "Select image file for avatar override",
      currentPassword: "Current Access Code",
      deleteAvatar: "Delete avatar",
      deleteAvatarConfirm: "CONFIRM AVATAR DELETION",
      newPassword: "New Access Code",
      noFileSelected: "No file detected",
      saveChanges: "COMMIT CHANGES",
      signedInWithGoogle: "Connected via Google Network",
      title: "USER PROFILE",
      updateProfile: "Update your profile matrix.",
      uploadYourAvatar: "Upload your avatar data"
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
      activateTwoFA: "Activate",
      confirmPassword: "Confirm Access Code",
      dangerZone: "DEREZZ Zone",
      deactivateTwoFA: "Deactivate",
      deactivateTwoFASetup: "Deactivate cipher configuration",
      deleteProfile: "Delete node",
      deleteProfileConfirm: "CONFIRM NODE DELETION",
      displayTwoFASetup: "Display cipher configuration",
      editTwoFASetup: "Edit your cipher configuration",
      enterTwoFACode: "Input cipher code:",
      preferredLanguage: "Select interface language protocol.",
      saveLanguage: "Save language preference",
      settings: "Configure your system parameters.",
      title: "System Settings",
      twoFAActivated: ["Cipher Active"],
      twoFABackupCode: "Backup cipher code",
      twoFABackupCodeInfo: [
        "These are your backup cipher codes.",
        "Copy or download them securely.",
        "",
        "They won't be shown again."
      ],
      twoFADownloadBackupCodes: "Download",
      twoFAGenerateBackupCodes: "Generate backup cipher codes",
      twoFAInfo: [
        "Activate Cipher:",
        "",
        "Use an Authenticator App",
        "to scan the QR code below."
      ],
      twoFASetup: "Cipher Configuration"
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
      player1Score: "Agent 1 Score",
      player2: "Agent 2",
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
      avatarDeleteFailed: "Avatar deletion interrupted. Reattempt required.",
      avatarDeleteSuccess: "Avatar successfully removed!",
      avatarUploadedSuccess: "Avatar successfully embedded!",
      avatarUploadFailed: "Avatar upload interrupted. Reattempt required.",
      chartCannotRemoveYourself: "Self-removal not permitted.",
      chartCompareMaxThree: "Data limit: 3 nodes.",
      chartError: "Chart failed to initialize",
      connectionLost:
        "Signal lost — attempting reconnection in {{delay}} cycles... (Attempt {{attempt}} of {{maxAttempts}})",
      connectionReestablished: "Signal reestablished",
      connectionUnavailable:
        "Reconnection failed. System halted until manual reboot.",
      emailExists: "Data address already exists in network",
      emailExistsWithGoogle:
        "Access conflict: Email registered via Google. Initiate Google sign-in protocol.",
      emailOrUsernameExists: "Data address or User ID already exists",
      emailOrUsernameNotExist: "Data address or User ID not existent",
      friendAcceptedFriendRequest:
        "<strong>{{username}}</strong> accepted link request",
      friendAdded: "Link established with <strong>{{username}}</strong>",
      friendDeclinedFriendRequest:
        "<strong>{{username}}</strong> rejected link request",
      friendRemovedFriend:
        "<strong>{{username}}</strong> disconnected from network",
      friendRequestButtonError: "Error processing link request",
      friendRequestEventError: "Error receiving link request.",
      friendRescindedFriendRequest:
        "<strong>{{username}}</strong> withdrew link request",
      friendSentFriendRequest:
        "<strong>{{username}}</strong> sent link request",
      invalidToken: "Token invalid",
      invalidUsernameOrPW: "Invalid User ID or access code",
      loginError: "Login failed. Reattempt required.",
      logoutError: "Logout failed. Reattempt required.",
      passwordUpdatedSuccess: "Access code updated successfully!",
      passwordUpdateFailed: "Access code update failed. Retry advised.",
      profileDeleteFailed: "Profile deletion failed. Retry advised.",
      profileDeleteSuccess: "Profile deleted successfully!",
      profileUpdatedSuccess: "Profile updated successfully!",
      profileUpdateFailed: "Profile update failed. Retry advised.",
      registrationSuccess:
        "Access node registration successful for {{username}}!",
      somethingWentWrong: "System anomaly detected",
      tabError: "Tab failed to initialize within the Grid.",
      tokenRefreshFailed: "Token refresh failed. Reattempt required.",
      tournamentAbortFailed:
        "Abort sequence failed. Grid anomaly detected. Retry advised.",
      tournamentAbortSuccess: "Abort sequence completed. Tournament derezzed.",
      tournamentFinishFailed:
        "Termination sequence failed. Grid anomaly detected. Retry advised.",
      tournamentFinishSuccess:
        "Termination sequence complete. Tournament derezzed.",
      twoFARemoveSuccess: "Cipher deactivated successfully!",
      twoFASetupSuccess: "Cipher activated successfully!",
      userAcceptedFriendRequest: "Accepted link request of ",
      userDeclinedFriendRequest: "Declined link request of ",
      userRemovedFriendship: "Connection terminated with ",
      userRescindedFriendRequest: "Deleted link request to ",
      userSendFriendRequestSuccess:
        "Link request successfully transmitted to <strong>{{username}}</strong>",
      userSendRequestFailed: "Error transmitting link request.",
      userStatus: "<strong>{{username}}</strong> status: {{status}}",
      userVerificationError:
        "An error occurred while verifying the user:<br>Redirecting to login.",
      validateTournamentNameError: "Error verifying tournament ID."
    },

    twoFABackupCodeVerifyView: {
      enterTwoFABackupCode: "Input backup cipher:",
      title: "Backup cipher verification",
      twoFABackupCode: "Backup cipher"
    },

    twoFAVerifyView: {
      enterTwoFACode: "Input cipher code:",
      title: "Cipher code verification",
      useBackupCode: "Deploy backup cipher"
    }
  }
};

export default tr;
