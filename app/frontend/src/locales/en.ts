const en = {
  translation: {
    error: {
      invalidDynamicRoutePattern: "Invalid dynamic route pattern: {{pattern}}",
      matchNotFound: "Match not found.",
      missingRequestID: "Request ID is missing.",
      nextMatchNotFound: "Next match not found.",
      noActiveToken: "No active token found.",
      nullMatches: "There are no matches.",
      requestNotFound: "Request with ID {{id}} not found.",
      somethingWentWrong: "Something went wrong.",
      tournamentIDNotFound: "Tournament ID not found.",
      undefinedMatch: "Match is undefined",
      unexpected: "An unexpected error occurred.",
      unknownRequestListType: "Unknown request list type: {{type}}",
      userNotFound: "User not found.",
      userStatsNotFound: "User statistics not found.",
      validateUser:
        "An error occurred while validating the user:<br>Redirecting to login page."
    },

    errorView: {
      details: "Details: {{cause}}",
      errorStatus: "⚠️ Error {{status}}",
      title: "Error",
      reload: "Reload"
    },

    friendListItem: {
      accept: "Accept",
      decline: "Decline",
      delete: "Delete",
      pending: "Pending",
      remove: "Remove"
    },

    friendsView: {
      addFriend: "Add a friend",
      confirmDeclineRequest: "Are you sure you want to decline this request?",
      confirmDeleteRequest: "Are you sure you want to delete this request?",
      confirmRemoveFriend: "Are you sure you want to remove this friend?",
      exactUsername: "Exact username",
      friendRequests: "Friend requests",
      title: "Friends",
      incomingRequests: "Incoming friend requests",
      noFriends: "You don't have any friends yet",
      noIncoming: "No incoming friend requests",
      noOutgoing: "No outgoing friend requests",
      outgoingRequests: "Outgoing friend requests",
      sendFriendRequest: "Send friend request",
      yourFriends: "Your friends"
    },

    gameView: {
      title: "Now Playing"
    },

    global: {
      avatar: "Avatar",
      confirmNewPassword: "Confirm new password",
      continue: "Press ENTER to continue",
      editProfile: "Edit your profile",
      email: "Email address",
      label: "{{field}}:",
      logout: "Logout",
      lost: "Lost",
      match: "Match {{matchId}}",
      offline: "Offline",
      online: "Online",
      password: "Password",
      twoFaCode: "2FA Code",
      pongGame: "Pong game",
      player: "Player",
      playerWins: "{{player}} wins",
      round: "Round {{round}}",
      toBeDefined: "To be defined",
      tournament: "Tournament: <strong>{{tournamentName}}</strong>",
      username: "Username",
      userNotFound: "User not found.",
      welcome: "Welcome",
      winnerMatch: "Winning match {{matchId}}",
      won: "Won"
    },

    homeView: {
      helloUser: "Hello {{username}}!<br />This is the homepage",
      title: "Home"
    },

    invalid: {
      emailEmpty: "The email address cannot be empty.",
      emailFormat: "The email address must be in a valid format.",
      emailOrUsernameEmpty: "Please enter a username or email address.",
      emailOrUsernameFormat: "The username or email address must be valid.",
      fillAtLeastOneField: "Please fill in at least one field.",
      fillInUsername: "Please enter a username.",
      imageFileEmpty: "Please select a file to upload.",
      imageFileFormat: "Please upload a valid image file.",
      nicknameEmpty: "Nickname cannot be empty.",
      nicknameFormat:
        "Nickname must be 3 to 20 characters and can include letters, digits or the following characters: -!?_$.",
      nicknameUniqueness: "Nickname must be unique.",
      passwordEmpty: "Password cannot be empty.",
      passwordFormat:
        "Password must be 10 to 64 characters and include at least one digit, one uppercase and one lowercase letter, and one special character from the set @$!%*?&",
      passwordConfirmationEmpty: "Please re-enter your password",
      passwordConfirmation: "Password confirmation does not match.",
      twoFaCode: "2FA code is invald.",
      twoFaCodeEmpty: "2FA code cannot be empty.",
      twoFaCodeFormat: "2FA code must be a 6-digit number.",
      twoFaBackupCode: "2FA backup code is invalid.",
      twoFaBackupCodeEmpty: "2FA backup code cannot be empty.",
      twoFaBackupCodeFormat: "2FA backup code must be a 8-digit number.",
      playerSelection: "Please select the number of players.",
      tournamentNameEmpty: "Tournament name cannot be empty.",
      tournamentNameFormat:
        "Tournament name must be 3 to 20 characters and can contain letters, digits or the following characters: -!?_$.",
      tournamentNameUniqueness: "Tournament name must be unique.",
      usernameEmpty: "Username cannot be empty.",
      usernameFormat:
        "Username must be 3 to 20 characters and can include letters, digits or the following characters: -!?_$.",
      usernameUniqueness: "Username must be unique."
    },

    loginView: {
      title: "Login",
      usernameOrEmail: "Username or email address"
    },

    twoFaVerifyView: {
      title: "2FA Verification",
      enterTwoFaCode: "Enter your 2FA code:",
      submitTwoFaCode: "Submit",
      useBackupCode: "Use backup code"
    },

    twoFaBackupCodeVerifyView: {
      title: "2FA Backup Code Verification",
      twoFaBackupCode: "2FA Backup Code",
      enterTwoFaBackupCode: "Enter your 2FA backup code:",
      submitTwoFaBackupCode: "Submit"
    },

    matchAnnouncementView: {
      abortTournament: "Abort Tournament",
      nextMatch: "Next match to play:",
      title: "Next Match!",
      roundMatch: "Round {{round}} - Match {{match}}",
      startMatch: "Start Match",
      tournamentStatus: "Tournament Status"
    },

    newGameView: {
      title: "New Game",
      selectPlayer: "Select which player will be controlled by {{username}}",
      startGame: "Start Game"
    },

    newTournamentView: {
      confirmAbortTournament: "Do you really want to cancel the tournament?",
      enterTournamentName: "Enter the tournament name",
      newTournamentDescription:
        "Enter the tournament name and select the number of players",
      title: "New Tournament",
      numberOfPlayers: "Number of players",
      players4: "4 players",
      players8: "8 players",
      players16: "16 players",
      startTournament: "Start Tournament",
      tournamentName: "Tournament name"
    },

    nicknameInput: {
      enterYourNickname: "Enter your nickname",
      playerChoice: "I am playing as player {{i}}",
      playerNickname: "Player {{i}}'s nickname"
    },

    playerNicknamesView: {
      enterPlayerNicknames: "Enter the players' nicknames",
      title: "Player Nicknames",
      selectControlledPlayer:
        "Select which player will be controlled by {{username}}",
      submitNicknames: "Submit Nicknames"
    },

    profileView: {
      cannotChangeEmailOrPW:
        "You cannot change your email address or password.",
      changeAvatar: "Change your avatar below.",
      changePasswordButton: "Change Password",
      changePassword: "Change your password below.",
      chooseFile: "Choose an image file for your avatar",
      currentPassword: "Current Password",
      newPassword: "New Password",
      noFileSelected: "No file selected",
      saveChanges: "Save Changes",
      signedInWithGoogle: "Signed in with Google",
      updateProfile: "Update your profile information below.",
      uploadYourAvatar: "Upload your avatar",
      title: "Your Profile"
    },

    registerView: {
      register: "Register here",
      title: "Register"
    },

    resultsView: {
      bracket: "Tournament Bracket",
      champion: "Champion",
      congratulations: "Congratulations on your victory!",
      finish: "Mark as Finished",
      title: "Results",
      tournamentResults: "Tournament Results"
    },

    settingsView: {
      title: "Settings",
      settings: "Set your preferences and settings here.",
      preferredLanguage: "Select your preferred language.",
      saveLanguage: "Save Language",
      twoFaSetup: "2FA Setup",
      twoFaInfo: [
        "Activate 2FA:",
        "",
        "please use an authenticator app",
        "to scan the QR code below."
      ],
      twoFaActivated: ["2FA activated"],
      twoFaBackupCode: "2FA Backup Code",
      enterTwoFaCode: "Enter your 2FA code:",
      activateTwoFa: "Activate",
      deactivateTwoFa: "Deactivate",
      twoFaGenerateBackupCodes: "Generate Backup Codes",
      confirmPassword: "Confirm",
      twoFaBackupCodeInfo: [
        "Those are your backup codes.",
        "Copy or download them",
        "",
        "They will not be shown again."
      ],
      twoFaDownloadBackupCodes: "Download"
    },

    statsView: {
      date: "Date",
      friendOnly: "You must be friends to view match history",
      joined: "Joined on",
      matchHistory: "Match History",
      played: "Played",
      player1: "Player 1",
      player2: "Player 2",
      player1Score: "Player 1 Score",
      player2Score: "Player 2 Score",
      result: "Result",
      title: "Statistics",
      tournament: "Tournament",
      winRate: "Win Rate"
    },

    toast: {
      acceptedFriendRequest: "Friend request accepted by ",
      avatarUploadFailed: "Avatar upload failed. Please try again.",
      avatarUploadedSuccess: "Avatar uploaded successfully!",
      connectionLost:
        "Connection lost - retrying in {{delay}} seconds... (Attempt {{attempt}} of {{maxAttempts}})",
      connectionReestablished: "Connection reestablished",
      connectionUnavailable:
        "Unable to reconnect. Attempts stopped until refresh.",
      declinedFriendRequest: "Friend request declined by ",
      deletedFriendRequest: "Friend request deleted by ",
      friendAdded: "Friend request accepted by {{username}} !",
      friendRequestButtonError: "Error processing friend request",
      emailExists: "The email address already exists",
      emailOrUsernameExists: "The email or username already exists",
      invalidUsernameOrPW: "Invalid username or password",
      logoutError: "Error logging out. Please try again.",
      passwordUpdateFailed: "Failed to update password. Please try again.",
      passwordUpdatedSuccess: "Password updated successfully!",
      twoFaSetupSuccess: "2FA setup successfully!",
      twoFaRemoveSuccess: "2FA deactivated successfully!",
      profileUpdateFailed: "Failed to update profile. Please try again.",
      profileUpdatedSuccess: "Profile updated successfully!",
      registrationSuccess: "Successfully registered {{username}}!",
      sendSuccess: "Friend request sent to {{username}}",
      terminatedFriendship: "Friendship terminated with ",
      tokenRefreshFailed: "Token refresh failed. Please try again.",
      userAcceptedFriendRequest:
        "Friend request from <strong>{{username}}</strong> accepted",
      userDeclinedFriendRequest:
        "Friend request from <strong>{{username}}</strong> declined",
      userRescindedFriendRequest:
        "Friend request from <strong>{{username}}</strong> rescinded",
      userRemovedFriend:
        "<strong>{{username}}</strong> has been removed from your friends",
      userSentFriendRequest:
        "Friend request from <strong>{{username}}</strong>",
      userStatus: "{{username}} is {{status}}",
      userVerificationError:
        "An error occurred while verifying the user:<br>Redirecting to login.",
      validateTournamentNameError:
        "An error occurred while validating the tournament name."
    }
  }
} as const;

type ToStringLeaves<T> = {
  [K in keyof T]: T[K] extends object ? ToStringLeaves<T[K]> : string;
};

export default en;
export type Translation = typeof en;
export type TranslationShape = ToStringLeaves<typeof en>;
