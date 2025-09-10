import { TranslationShape } from "./en.js";

const pi: TranslationShape = {
  translation: {
    chart: {
      activity: "Booty Huntin'",
      current: "As o' Now",
      loss: "Defeats",
      numPlayers: "{{num}} sea dogs",
      played: "Battles fought{{range}}",
      progress: "Climb - {{num}} sea dogs",
      progression: "Victory Percentage{{range}}",
      rangeLastDays: " - last {{count}} Days",
      rangeLastMatches: " - last {{count}} Battles",
      reachedThisStage: "Landed 'ere",
      scoreDiff: "Score Gap{{range}}",
      scores: "Booty Count{{range}}",
      selectUpTo: "Pick ye up to 3 mateys, arrr!",
      summary: "Battle Recap",
      win: "Victory",
      winLoss: "Plunder vs Defeats{{range}}"
    },

    error: {
      invalidDynamicRoutePattern:
        "Treasure map full o' rum stains: {{pattern}}",
      matchNotFound: "Battle not in the logs.",
      missingRequestID: "Request ID lost to the sea.",
      nextMatchNotFound: "No next duel in sight!",
      noActiveToken: "No worthy token found.",
      nullMatches: "No battles fought - too peaceful!",
      requestNotFound: "Request with ID {{id}} lost to the depths.",
      somethingWentWrong: "A kraken messed with the code.",
      tournamentIDNotFound: "No flag found for that tourney!",
      undefinedMatch: "Battle be undefined!",
      unexpected: "A mysterious curse befall'd th' ship!",
      unknownRequestListType: "Unknown sea chart: {{type}}",
      userNotFound: "No sailor found with that name.",
      userStatsNotFound: "Couldn't find this mate's logs.",
      validateUser: "Problem with yer pirate pass:<br>Back to port (login)!"
    },

    errorView: {
      details: "Details, ye scurvy dog: {{cause}}",
      errorStatus: "⚠️ Blimey! Error {{status}}",
      reload: "Try Again, Matey",
      title: "Whoopsie!"
    },

    friendListItem: {
      accept: "Aye!",
      decline: "Nay!",
      delete: "Scuttle it!",
      pending: "Awaitin'",
      remove: "Throw Overboard"
    },

    friendsView: {
      addFriend: "Add a shipmate",
      confirmDeclineRequest:
        "Ye sure ye want to toss this request to the briny deep?",
      confirmDeleteRequest: "Be ye certain this request should walk the plank?",
      confirmRemoveFriend: "Ye really want to maroon this mate?",
      exactUsername: "True sailor's name",
      friendRequests: "Parley Requests",
      incomingRequests: "Incoming messages in bottles",
      noFriends: "Ye be all alone on this vessel",
      noIncoming: "No messages in bottles",
      noOutgoing: "No parrots flyin' out",
      outgoingRequests: "Sent yer parrots",
      sendFriendRequest: "Send a parley request",
      title: "Me Hearties",
      yourFriends: "Yer loyal crew"
    },

    gameView: {
      title: "Now Battlin'"
    },

    global: {
      avatar: "Jolly Roger",
      confirmNewPassword: "Confirm yer new secret code",
      continue: "Hit ENTER to sail onward",
      editProfile: "Polish yer pirate profile",
      email: "Message-in-a-bottle address",
      label: "{{field}}:",
      logout: "Abandon Ship",
      lost: "Overboard!",
      match: "Battle {{matchId}}",
      matchWinner: "Skirmish {{matchId}} plunderer",
      offline: "Adrift",
      online: "Ahoy!",
      password: "Secret Code",
      player: "Pirate",
      playerWins: "{{player}} plunders the win!",
      pongGame: "High-Seas Paddle Fight",
      round: "Round {{round}}",
      submit: "Hoist it!",
      toBeDefined: "Still on the map",
      tournament: "Tourney o' Legends: <strong>{{tournamentName}}</strong>",
      twoFACode: "Secret Digits Code",
      username: "Pirate Name",
      userNotFound: "No such matey found.",
      welcome: "Ahoy there!",
      won: "Victory!"
    },

    homeView: {
      faqControlsLeftPaddle: "Steer left paddle: W / S",
      faqControlsRightPaddle: "Steer right paddle: Arrow Keys ↑ ↓",
      faqControlsTitle: "Ship Controls",

      faqExtrasText:
        "Pong be sailin' into the neon seas, matey! One o' th' first battles ever fought in code, now reborn on a glowing grid. Welcome aboard the Light Cycle of Pong, where only the sharpest pirates claim the treasure!",
      faqExtrasTitle: "Lore o' the Sea",
      faqGameModesSingle: "Single Duel: Quick bout against the AI or a matey.",
      faqGameModesTitle: "Modes o' Battle",

      faqGameModesTournament:
        "Tournament: Fight through many rounds 'til one pirate claims the booty.",
      faqTips1: "Predict the ball's course instead o' chasin' it.",
      faqTips2: "Use the edges o' yer paddle to change the trajectory.",

      faqTips3: "Beware! Each hit makes the ball fly faster, arrr!",
      faqTipsTitle: "Seafarin' Tips",
      faqTitle: "Parley FAQ",
      helloUser: "Ahoy {{username}}!",

      tagline: "Enter the Grid. Master the Pong.",
      title: "Captain's Quarters"
    },

    invalid: {
      emailEmpty: "Can't send nothin' with an empty bottle!",
      emailFormat: "Yer bottle label be wrong!",
      emailOrUsernameEmpty: "Give us a name or bottle, ya scallywag!",
      emailOrUsernameFormat: "That ain't a proper sailor name or address!",
      fillAtLeastOneField: "Fill at least one chest, matey!",
      fillInUsername: "Enter yer name, ye bilge rat!",
      friendNotSelf: "Ye can't be addin' yerself to yer crew!",
      friendRequestAlreadySent: "Ye already sent a parley request.",
      friendsAlready: "Ye be already mates!",
      imageFileEmpty: "Pick a painting, mate!",
      imageFileFormat: "That ain't a proper lookin' portrait!",
      nicknameEmpty: "Ye need a pirate name!",
      nicknameFormat:
        "Make it 3-20 letters, and use swashbucklin' marks like -!?_$.",
      nicknameUniqueness: "That pirate name be taken!",
      passwordConfirmation: "Codes don't match! Ye fool!",
      passwordConfirmationEmpty: "Confirm yer code, or walk the plank!",
      passwordEmpty: "Don't leave yer treasure chest wide open!",
      passwordFormat:
        "Yer code needs numbers, big letters, little letters, and pirate symbols @$!%*?&",
      playerSelection: "Pick yer fighters, landlubber!",
      tournamentNameEmpty: "No name, no fame!",
      tournamentNameFormat: "Needs 3-20 marks like -!?_$.",
      tournamentNameUniqueness: "That name's already carved into the deck!",
      twoFABackupCode: "Yer spare secret digits be wrong, ye scallywag!",
      twoFABackupCodeEmpty:
        "Don't be leavin' yer spare digits chest all empty, matey!",
      twoFABackupCodeFormat:
        "That spare chest be needin' eight shiny numbers, not a digit more or less!",
      twoFACode: "Yer secret digits be wrong, savvy!",
      twoFACodeEmpty: "Don't leave yer secret digits chest all empty, matey!",
      twoFACodeFormat:
        "That secret chest be needin' six shiny numbers, no more, no less!",
      usernameEmpty: "Ye forgot yer name!",
      usernameFormat: "Name be 3-20 letters and seaworthy marks -!?_$.",
      usernameUniqueness: "That name be claimed by another seadog!"
    },

    loginView: {
      title: "Board the Ship",
      usernameOrEmail: "Pirate name or address"
    },

    matchAnnouncementView: {
      abortTournament: "Scuttle the Tournament!",
      nextMatch: "Next skirmish to set sail",
      roundMatch: "Round {{round}} - Clash {{match}}",
      skipMatch: "Skip this skirmish",
      spectateMatch: "Spy on the duel",
      startMatch: "Hoist the Colors!",
      title: "Upcoming Duel!"
    },

    newGameView: {
      aiOption: "Optional: let the cursed AI take the other deckhand!",
      enterNickname: "Give each swabbie a name, ye scallywag!",
      selectPlayer: "Choose which salty dog {{username}} will command!",
      startGame: "Set Sail!",
      title: "Raise the Jolly Roger!"
    },

    newTournamentView: {
      confirmAbortTournament: "Be ye sure ye want to abandon the tourney?",
      enterTournamentName: "Name this noble contest",
      numberOfPlayers: "Number o' Buccaneers",
      players16: "16 Sea Wolves",
      players4: "4 Scallywags",
      players8: "8 Swashbucklers",
      selectNumberPlayers: "Choose how many will duel",
      startTournament: "Let the Games Begin!",
      title: "Forge a New Tournament",
      tournamentName: "Tourney Name"
    },

    nicknameInput: {
      aiPlayer: "Ghost o' the Sea (AI)",
      aiStrength: "Cunning o' the Machine",
      aiStrengthEasy: "Cabin boy",
      aiStrengthHard: "Captain",
      aiStrengthMedium: "Sailor",
      enterYourNickname: "Give us yer pirate alias",
      playerChoice: "{{username}} be playin' as buccaneer {{i}}",
      playerNickname: "Name fer pirate {{i}}"
    },

    playerNicknamesView: {
      aiOptions: "Optional: let the cursed AI take a deckhand!",
      enterPlayerNicknames: "Give each swabbie their name",
      submitNicknames: "Let 'em be known!",
      title: "Name Yer Crew"
    },

    profileView: {
      cannotChangeEmailOrPW: "Yer bottle code and secret phrase be fixed!",
      changeAvatar: "Change yer Jolly Roger.",
      changePassword: "Swap yer secret.",
      changePasswordButton: "Change Secret Phrase",
      chooseFile: "Pick an image fer yer pirate flag",
      currentPassword: "Old Code",
      deleteAvatar: "Burn yer Jolly Roger",
      deleteAvatarConfirm: "Ye sure ye want to burn yer Jolly Roger?",
      newPassword: "New Secret Phrase",
      noFileSelected: "No treasure map selected",
      saveChanges: "Stash Yer Changes",
      signedInWithGoogle: "Boarded via Google raft",
      title: "Yer Scroll of Legend",
      updateProfile: "Update yer scroll of records.",
      uploadYourAvatar: "Raise yer avatar!"
    },

    registerView: {
      register: "Join the Crew",
      title: "Sign the Ship's Ledger"
    },

    resultsView: {
      bracket: "Map o' the Battles",
      champion: "The Sea King",
      congratulations: "Ye won the ocean's glory!",
      finish: "Mark as Conquered",
      title: "Spoils o' War",
      tournamentResults: "Tourney Loot Report"
    },

    settingsView: {
      activateTwoFA: "Hoist the Flag",
      confirmPassword: "Confirm yer secret code",
      dangerZone: "Beware! Davy Jones' Locker Awaits",
      deactivateTwoFA: "Lower the Colors",
      deactivateTwoFASetup: "2FA deaktivieren",
      deleteProfile: "Send yer profile to Davy Jones",
      deleteProfileConfirm:
        "Ye sure ye want to send yer profile to Davy Jones?",
      displayTwoFASetup: "Scuttle the Secret Digits",
      editTwoFASetup: "Tweak yer secret digits riggin'",
      enterTwoFACode: "Enter yer secret digits:",
      preferredLanguage: "Choose yer tongue, matey.",
      saveLanguage: "Stash yer tongue",
      settings: "Change yer sails and adjust the wind here.",
      title: "Captain's Preferences",
      twoFAActivated: ["Flyin' high"],
      twoFABackupCode: "Spare secret digits",
      twoFABackupCodeInfo: [
        "Here be yer spare secret digits.",
        "Copy 'em down or save 'em to yer chest,",
        "",
        "They won't be shown again, savvy?"
      ],
      twoFADownloadBackupCodes: "Download Yer Treasure",
      twoFAGenerateBackupCodes: "Forge new spare secret digits",
      twoFAInfo: [
        "Rigg the Secret Digits:",
        "",
        "Use a trusty Authenticator App,",
        "to scan the QR treasure map below."
      ],
      twoFASetup: "Riggin' the Secret Digits"
    },

    statsView: {
      dashboard: "Cap`n`s Log",
      date: "Chart Date",
      details: "Secrets",
      eliminatedInRound: "Keelhauled in round {{round}}, arr!",
      friendOnly:
        "Ye must be true mates to lay eyes on these secret scrolls o' stats!",
      friends: "Mates",
      joined: "Join'd on {{date}}",
      matches: "Battles",
      matchHistory: "Past Duels",
      played: "Engaged",
      player1: "Buccaneer 1",
      player1Score: "Buccaneer 1's Plunder",
      player2: "Buccaneer 2",
      player2Score: "Buccaneer 2's Booty",
      result: "Outcome",
      title: "Ship Logs",
      tournament: "Skull & Crossbones Cup",
      tournaments: "Skull & Crossbones Cups",
      usedNickname: "Name ye used",
      winRate: "Victory Percentage",
      winstreakCur: "Plunder Trail",
      winstreakMax: "Mighty Streak"
    },

    toast: {
      avatarDeleteFailed: "Couldn't burn yer flag - try again!",
      avatarDeleteSuccess: "Yer flag be burnin' high now!",
      avatarUploadedSuccess: "Yer colors be flyin' high now!",
      avatarUploadFailed: "Couldn't hoist yer flag - try again!",
      chartCannotRemoveYourself: "Ye can't be tossin' yerself.",
      chartCompareMaxThree: "Ye can weigh up no more than 3 mateys.",
      chartError: "Thar be a chart that refused t' hoist its sails",
      connectionLost:
        "Connection to the crow's nest lost - tryin' again in {{delay}} seconds... (Try {{attempt}} o' {{maxAttempts}})",
      connectionReestablished: "Riggings reattached!",
      connectionUnavailable:
        "No more wind in the sails - retries stopped 'til refresh!",
      emailExists: "That bottle's already adrift",
      emailExistsWithGoogle:
        "Arrr! This bottle be already claimed by Google. Log in with yer Google account, matey!",
      emailOrUsernameExists: "That name or bottle already has a captain",
      emailOrUsernameNotExist: "That name or bottle not yet be sailin'",
      friendAcceptedFriendRequest:
        "<strong>{{username}}</strong> accepted the parley",
      friendAdded: "New crewmate <strong>{{username}}</strong> aboard!",
      friendDeclinedFriendRequest:
        "<strong>{{username}}</strong> declined the parley",
      friendRemovedFriend:
        "<strong>{{username}}</strong> tossed ya from his crew",
      friendRequestButtonError: "Error with yer parley request",
      friendRequestEventError:
        "Trouble while receivin' a parley request signal!",
      friendRescindedFriendRequest:
        "<strong>{{username}}</strong> withdrew parley request",
      friendSentFriendRequest: "<strong>{{username}}</strong> wants a parley",
      gameSaveSuccess: "Game be stashed safe, arrr!",
      gameSaveFailed: "Couldn't stash the game, ye scallywag!",
      invalidToken: "Yer token be counterfeit!",
      invalidUsernameOrPW: "Yer name or code be wrong, matey!",
      loginError: "Couldn't board ship - try again!",
      logoutError: "Couldn't abandon ship - try again!",
      passwordUpdatedSuccess: "Secret code changed! Keep it close!",
      passwordUpdateFailed:
        "Couldn't set yer new passphrase. Try again or be cursed!",
      profileDeleteFailed:
        "The sea refused the sacrifice — yer profile remains",
      profileDeleteSuccess:
        "The deed be done — ye profile sleeps wit' the fishes!",

      profileUpdatedSuccess: "Profile polished like a cutlass!",
      profileUpdateFailed: "Profile be cursed - try again later!",
      registrationSuccess: "You be aboard, sailor {{username}}!",
      somethingWentWrong: "Arrr, somethin' went off course!",
      tabError: "Arrr! This here tab be refusin' to set sail!",
      tokenRefreshFailed: "Couldn't refresh yer token - try again!",
      tournamentAbortFailed:
        "Arrr! The tourney wouldn't be scuttled. Try again, ye scallywag!",
      tournamentAbortSuccess: "The tourney be sunk an' done fer!",
      tournamentFinishFailed:
        "Arrr! The tourney won't end fer some cursed reason. Try again, matey!",
      tournamentFinishSuccess: "The tourney be done an' dusted, savvy!",
      twoFARemoveSuccess: "Secret digits be scuttled! Ye be sailin' free!",
      twoFASetupSuccess: "Secret digits be rigged 'n ready!",
      userAcceptedFriendRequest: "Accepted parley of ",
      userDeclinedFriendRequest: "Declined parley of ",
      userRemovedFriendship: "Ye cut ties with ",
      userRescindedFriendRequest: "Sunk parley request to ",
      userSendFriendRequestSuccess:
        "Parley sent to the high seas to <strong>{{username}}</strong>!",
      userSendRequestFailed: "Trouble while sendin' yer parley request!",
      userStatus: "<strong>{{username}}</strong> be {{status}}",
      userVerificationError:
        "Yer pirate pass be faulty:<br>Back to the login docks.",
      validateTournamentNameError:
        "Tourney name not approved by the Pirate Council."
    },

    twoFABackupCodeVerifyView: {
      enterTwoFABackupCode: "Enter yer spare secret digits:",
      title: "Verify yer spare secret digits",
      twoFABackupCode: "Spare secret digits:"
    },

    twoFAVerifyView: {
      enterTwoFACode: "Enter yer secret digits:",
      title: "Verify yer secret digits code",
      useBackupCode: "Use yer spare code"
    }
  }
};

export default pi;
