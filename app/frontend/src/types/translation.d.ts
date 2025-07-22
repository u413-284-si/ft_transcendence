export type Translation = {
  error: {
    invalidDynamicRoutePattern: string;
    matchNotFound: string;
    missingRequestID: string;
    nextMatchNotFound: string;
    noActiveToken: string;
    nullMatches: string;
    requestNotFound: string;
    somethingWentWrong: string;
    tournamentIDNotFound: string;
    undefinedMatch: string;
    unexpected: string;
    unknownRequestListType: string;
    userNotFound: string;
    userStatsNotFound: string;
    validateUser: string;
  };

  errorView: {
    details: string;
    errorStatus: string;
    title: string;
    reload: string;
  };

  friendListItem: {
    accept: string;
    decline: string;
    delete: string;
    pending: string;
    remove: string;
  };

  friendsView: {
    addFriend: string;
    confirmDeclineRequest: string;
    confirmDeleteRequest: string;
    confirmRemoveFriend: string;
    exactUsername: string;
    friendRequests: string;
    title: string;
    incomingRequests: string;
    noFriends: string;
    noIncoming: string;
    noOutgoing: string;
    outgoingRequests: string;
    sendFriendRequest: string;
    yourFriends: string;
  };

  gameView: {
    title: string;
  };

  global: {
    avatar: string;
    confirmNewPassword: string;
    continue: string;
    editProfile: string;
    email: string;
    label: string;
    logout: string;
    lost: string;
    match: string;
    offline: string;
    online: string;
    password: string;
    pongGame: string;
    player: string;
    playerWins: string;
    round: string;
    toBeDefined: string;
    tournament: string;
    username: string;
    userNotFound: string;
    welcome: string;
    winnerMatch: string;
    won: string;
  };

  homeView: {
    helloUser: string;
    title: string;
  };

  invalid: {
    emailEmpty: string;
    emailFormat: string;
    emailOrUsernameEmpty: string;
    emailOrUsernameFormat: string;
    fillAtLeastOneField: string;
    fillInUsername: string;
    imageFileEmpty: string;
    imageFileFormat: string;
    nicknameEmpty: string;
    nicknameFormat: string;
    nicknameUniqueness: string;
    passwordEmpty: string;
    passwordFormat: string;
    passwordConfirmationEmpty: string;
    passwordConfirmation: string;
    playerSelection: string;
    tournamentNameEmpty: string;
    tournamentNameFormat: string;
    tournamentNameUniqueness: string;
    usernameEmpty: string;
    usernameFormat: string;
    usernameUniqueness: string;
  };

  loginView: {
    title: string;
    usernameOrEmail: string;
  };

  matchAnnouncementView: {
    abortTournament: string;
    nextMatch: string;
    title: string;
    roundMatch: string;
    startMatch: string;
    tournamentStatus: string;
  };

  newGameView: {
    title: string;
    selectPlayer: string;
    startGame: string;
  };

  newTournamentView: {
    confirmAbortTournament: string;
    enterTournamentName: string;
    newTournamentDescription: string;
    title: string;
    numberOfPlayers: string;
    players4: string;
    players8: string;
    players16: string;
    startTournament: string;
    tournamentName: string;
  };

  nicknameInput: {
    enterYourNickname: string;
    playerChoice: string;
    playerNickname: string;
  };

  playerNicknamesView: {
    enterPlayerNicknames: string;
    title: string;
    selectControlledPlayer: string;
    submitNicknames: string;
  };

  profileView: {
    cannotChangeEmailOrPW: string;
    changeAvatar: string;
    changePasswordButton: string;
    changePassword: string;
    chooseFile: string;
    currentPassword: string;
    newPassword: string;
    noFileSelected: string;
    saveChanges: string;
    signedInWithGoogle: string;
    updateProfile: string;
    uploadYourAvatar: string;
    title: string;
  };

  registerView: {
    register: string;
    title: string;
  };

  resultsView: {
    bracket: string;
    champion: string;
    congratulations: string;
    finish: string;
    title: string;
    tournamentResults: string;
  };

  settingsView: {
    preferredLanguage: string;
    saveLanguage: string;
    settings: string;
    title: string;
  };

  statsView: {
    date: string;
    friendOnly: string;
    joined: string;
    matchHistory: string;
    played: string;
    player1: string;
    player2: string;
    player1Score: string;
    player2Score: string;
    result: string;
    title: string;
    tournament: string;
    winRate: string;
  };

  toast: {
    acceptedFriendRequest: string;
    avatarUploadFailed: string;
    avatarUploadedSuccess: string;
    connectionLost: string;
    connectionReestablished: string;
    connectionUnavailable: string;
    declinedFriendRequest: string;
    deletedFriendRequest: string;
    friendAdded: string;
    friendRequestButtonError: string;
    emailExists: string;
    emailOrUsernameExists: string;
    invalidUsernameOrPW: string;
    logoutError: string;
    passwordUpdateFailed: string;
    passwordUpdatedSuccess: string;
    profileUpdateFailed: string;
    profileUpdatedSuccess: string;
    registrationSuccess: string;
    sendSuccess: string;
    terminatedFriendship: string;
    tokenRefreshFailed: string;
    userAcceptedFriendRequest: string;
    userDeclinedFriendRequest: string;
    userRescindedFriendRequest: string;
    userRemovedFriend: string;
    userSentFriendRequest: string;
    userStatus: string;
    userVerificationError: string;
    validateTournamentNameError: string;
  };
};
