import { TranslationShape } from "./en.js";

const pi: TranslationShape = {
  translation: {
    error: {
      invalidDynamicRoutePattern:
        "Treasure map full o' rum stains: {{pattern}}",
      matchNotFound: "Battle not in the logs.",
      missingRequestID: "Request ID lost to the sea.",
      nextMatchNotFound: "No next duel in sight!",
      noActiveToken: "No worthy token found.",
      nullMatches: "No battles fought – too peaceful!",
      requestNotFound: "Request with ID {{id}} lost to the depths.",
      somethingWentWrong: "A kraken messed with the code.",
      tournamentIDNotFound: "No flag found for that tourney!",
      undefinedMatch: "Battle be undefined!",
      unexpected: "A mysterious curse befall'd th’ ship!",
      unknownRequestListType: "Unknown sea chart: {{type}}",
      userNotFound: "No sailor found with that name.",
      userStatsNotFound: "Couldn’t find this mate’s logs.",
      validateUser: "Problem with yer pirate pass:<br>Back to port (login)!"
    },

    errorView: {
      details: "Details, ye scurvy dog: {{cause}}",
      errorStatus: "⚠️ Blimey! Error {{status}}",
      title: "Whoopsie!",
      reload: "Try Again, Matey"
    },

    friendListItem: {
      accept: "Aye!",
      decline: "Nay!",
      delete: "Scuttle it!",
      pending: "Awaitin’",
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
      title: "Me Hearties",
      incomingRequests: "Incoming messages in bottles",
      noFriends: "Ye be all alone on this vessel",
      noIncoming: "No messages in bottles",
      noOutgoing: "No parrots flyin’ out",
      outgoingRequests: "Sent yer parrots",
      sendFriendRequest: "Send a parley request",
      yourFriends: "Yer loyal crew"
    },

    gameView: {
      title: "Now Battlin’"
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
      offline: "Adrift",
      online: "Ahoy!",
      password: "Secret Code",
      pongGame: "High-Seas Paddle Fight",
      player: "Pirate",
      playerWins: "{{player}} plunders the win!",
      round: "Round {{round}}",
      toBeDefined: "Still on the map",
      tournament: "Tourney o’ Legends: <strong>{{tournamentName}}</strong>",
      username: "Pirate Name",
      userNotFound: "No such matey found.",
      welcome: "Ahoy there!",
      winnerMatch: "Victor o’ match {{matchId}}",
      won: "Victory!"
    },

    homeView: {
      helloUser: "Ahoy {{username}}!<br />Ye've landed on the home deck",
      title: "Captain's Quarters"
    },

    invalid: {
      emailEmpty: "Can’t send nothin’ with an empty bottle!",
      emailFormat: "Yer bottle label be wrong!",
      emailOrUsernameEmpty: "Give us a name or bottle, ya scallywag!",
      emailOrUsernameFormat: "That ain't a proper sailor name or address!",
      fillAtLeastOneField: "Fill at least one chest, matey!",
      fillInUsername: "Enter yer name, ye bilge rat!",
      imageFileEmpty: "Pick a painting, mate!",
      imageFileFormat: "That ain’t a proper lookin’ portrait!",
      nicknameEmpty: "Ye need a pirate name!",
      nicknameFormat:
        "Make it 3–20 letters, and use swashbucklin’ marks like -!?_$.",
      nicknameUniqueness: "That pirate name be taken!",
      passwordEmpty: "Don’t leave yer treasure chest wide open!",
      passwordFormat:
        "Yer code needs numbers, big letters, little letters, and pirate symbols @$!%*?&",
      twoFaCodeEmpty: "Don’t leave yer secret digits chest all empty, matey!",
      twoFaCodeFormat:
        "That secret chest be needin’ six shiny numbers, no more, no less!",
      passwordConfirmationEmpty: "Confirm yer code, or walk the plank!",
      passwordConfirmation: "Codes don't match! Ye fool!",

      playerSelection: "Pick yer fighters, landlubber!",
      tournamentNameEmpty: "No name, no fame!",
      tournamentNameFormat: "Needs 3–20 marks like -!?_$.",
      tournamentNameUniqueness: "That name’s already carved into the deck!",
      usernameEmpty: "Ye forgot yer name!",
      usernameFormat: "Name be 3–20 letters and seaworthy marks -!?_$.",
      usernameUniqueness: "That name be claimed by another seadog!"
    },

    loginView: {
      title: "Board the Ship",
      usernameOrEmail: "Pirate name or message bottle address:"
    },

    matchAnnouncementView: {
      abortTournament: "Scuttle the Tournament!",
      nextMatch: "Next skirmish to set sail:",
      title: "Upcoming Duel!",
      roundMatch: "Round {{round}} – Clash {{match}}",
      startMatch: "Hoist the Colors!",
      tournamentStatus: "State o’ the Tourney"
    },

    newGameView: {
      title: "Raise the Jolly Roger!",
      selectPlayer: "Choose which salty dog {{username}} will command",
      startGame: "Set Sail!"
    },

    newTournamentView: {
      confirmAbortTournament: "Be ye sure ye want to abandon the tourney?",
      enterTournamentName: "Name this noble contest",
      newTournamentDescription:
        "Name yer tournament and choose how many will duel",
      title: "Forge a New Tournament",
      numberOfPlayers: "Number o' Buccaneers",
      players4: "4 Scallywags",
      players8: "8 Swashbucklers",
      players16: "16 Sea Wolves",
      startTournament: "Let the Games Begin!",
      tournamentName: "Tourney Name"
    },

    nicknameInput: {
      enterYourNickname: "Give us yer pirate alias",
      playerChoice: "I be playin’ as buccaneer {{i}}",
      playerNickname: "Name fer pirate {{i}}"
    },

    playerNicknamesView: {
      enterPlayerNicknames: "Give each swabbie their name",
      title: "Name Yer Crew",
      selectControlledPlayer: "Choose which deckhand {{username}} will command",
      submitNicknames: "Let 'em be known!"
    },

    profileView: {
      cannotChangeEmailOrPW: "Yer bottle code and secret phrase be fixed!",
      changeAvatar: "Change yer Jolly Roger below",
      changePasswordButton: "Change Secret Phrase",
      changePassword: "Swap yer secret below",
      chooseFile: "Pick an image fer yer pirate flag",
      currentPassword: "Old Code",
      newPassword: "New Secret Phrase",
      noFileSelected: "No treasure map selected",
      saveChanges: "Stash Yer Changes",
      signedInWithGoogle: "Boarded via Google raft",
      updateProfile: "Update yer scroll of records below",
      uploadYourAvatar: "Raise yer avatar to the crow’s nest!",
      title: "Yer Scroll of Legend"
    },

    registerView: {
      register: "Join the Crew",
      title: "Sign the Ship’s Ledger"
    },

    resultsView: {
      bracket: "Map o’ the Battles",
      champion: "The Sea King",
      congratulations: "Ye won the ocean’s glory!",
      finish: "Mark as Conquered",
      title: "Spoils o’ War",
      tournamentResults: "Tourney Loot Report"
    },

    settingsView: {
      preferredLanguage: "Choose yer tongue, matey.",
      saveLanguage: "Stash yer tongue",
      settings: "Change yer sails and adjust the wind here.",
      title: "Captain’s Preferences"
    },

    statsView: {
      date: "Chart Date",
      friendOnly: "Only mates get to see yer ship logs",
      joined: "Swore the Oath on",
      matchHistory: "Past Duels",
      played: "Engaged",
      player1: "Buccaneer 1",
      player2: "Buccaneer 2",
      player1Score: "Buccaneer 1’s Plunder",
      player2Score: "Buccaneer 2’s Booty",
      result: "Outcome",
      title: "Ship Logs",
      tournament: "Skull & Crossbones Cup",
      winRate: "Victory Percentage"
    },

    toast: {
      acceptedFriendRequest: "Parley accepted by ",
      avatarUploadFailed: "Couldn’t hoist yer flag – try again!",
      avatarUploadedSuccess: "Yer colors be flyin’ high now!",
      connectionLost:
        "Connection to the crow's nest lost – tryin’ again in {{delay}} seconds... (Try {{attempt}} o’ {{maxAttempts}})",
      connectionReestablished: "Riggings reattached!",
      connectionUnavailable:
        "No more wind in the sails – retries stopped ‘til refresh!",
      declinedFriendRequest: "Parley declined by ",
      deletedFriendRequest: "Parley request sunk by ",
      friendAdded: "New crewmate {{username}} aboard!",
      friendRequestButtonError: "Error with yer parley request",
      emailExists: "That bottle's already adrift",
      emailOrUsernameExists: "That name or bottle already has a captain",
      logoutError: "Couldn’t abandon ship – try again!",
      invalidUsernameOrPW: "Yer name or code be wrong, matey!",
      passwordUpdateFailed:
        "Couldn’t set yer new passphrase. Try again or be cursed!",
      passwordUpdatedSuccess: "Secret code changed! Keep it close!",
      profileUpdateFailed: "Profile be cursed – try again later!",
      profileUpdatedSuccess: "Profile polished like a cutlass!",
      registrationSuccess: "You be aboard, sailor {{username}}!",
      sendSuccess: "Parley sent to the high seas to {{username}}!",
      terminatedFriendship: "Ye cut ties with ",
      tokenRefreshFailed: "Couldn’t refresh yer token – try again!",
      userAcceptedFriendRequest:
        "Parley with <strong>{{username}}</strong> accepted",
      userDeclinedFriendRequest:
        "Parley from <strong>{{username}}</strong> declined",
      userRescindedFriendRequest:
        "Parley from <strong>{{username}}</strong> withdrawn",
      userRemovedFriend:
        "<strong>{{username}}</strong> be tossed from yer crew",
      userSentFriendRequest: "Parley from <strong>{{username}}</strong>",
      userStatus: "{{username}} be {{status}}",
      userVerificationError:
        "Yer pirate pass be faulty:<br>Back to the login docks.",
      validateTournamentNameError:
        "Tourney name not approved by the Pirate Council."
    }
  }
};

export default pi;
