export type QuestionOption = {
  value: string
  label: string
}

export type Question = {
  id: string
  text: string
  type: "radio" | "checkbox" | "textarea" | "rank" | "yesno"
  options?: QuestionOption[]
  rankOptions?: string[] // For rank type
  subText?: string
}

export type SurveyCategory = {
  id: string
  name: string
  icon: string // Lucide icon name
  description: string
  questions: Question[]
}

export const surveyCategories: SurveyCategory[] = [
  {
    id: "fargepreferanser",
    name: "Fargepreferanser",
    icon: "Palette",
    description: "Jeg så denne personlighetstesten om fargepsykologi...",
    questions: [
      {
        id: "moodColorCombo",
        text: "Hvis humøret ditt i dag var en fargekombo, hva ville det vært?",
        type: "radio",
        options: [
          { value: "sunset", label: "Solnedgangsvibes (rosa/oransje/lilla)" },
          { value: "ocean", label: "Havdrømmer (blå/turkis/hvit)" },
          { value: "forest", label: "Skogmeditasjon (grønn/brun/gull)" },
          { value: "galaxy", label: "Galakseestetikk (lilla/svart/sølv)" },
        ],
      },
      {
        id: "phoneCaseColor",
        text: "Hvilken mobildekkselfargekombo ville du aldri blitt lei av?",
        type: "radio",
        options: [
          { value: "pastelRainbow", label: "Pastellregnbuegradient" },
          { value: "matteBlackGold", label: "Matt svart med gulldetaljer" },
          { value: "deepGemstones", label: "Dype edelstensfarger (smaragd/safir)" },
          { value: "softNeutrals", label: "Myke nøytraler (beige/krem/rosa)" },
        ],
      },
      {
        id: "relationshipPalette",
        text: "Hvis forholdet vårt var en fargepalett, ville det vært...",
        type: "radio",
        options: [
          { value: "warmCozy", label: "Varmt og koselig (burgunder/rav/krem)" },
          { value: "freshBright", label: "Friskt og lyst (mynte/korall/hvit)" },
          { value: "deepIntense", label: "Dypt og intenst (marineblå/burgunder/gull)" },
          { value: "softDreamy", label: "Mykt og drømmende (lavendel/rose/sølv)" },
        ],
      },
    ],
  },
  {
    id: "underholdning",
    name: "Underholdningspreferanser",
    icon: "PlaySquare",
    description: "Kollegaen min fikk oss til å gjøre denne random quizen i lunsjen...",
    questions: [
      {
        id: "sundayPlaylist",
        text: "Din perfekte søndagmorgen-spilleliste er mest:",
        type: "radio",
        options: [
          { value: "chillIndie", label: "Chill indie/akustiske vibes" },
          { value: "feelGoodPop", label: "Feel-good pophits" },
          { value: "rnbSoul", label: "R&B og soulklassikere" },
          { value: "moodMatch", label: "Hva som helst som matcher humøret mitt" },
        ],
      },
      {
        id: "movieGenreMonth",
        text: "Hvis du måtte velge én filmsjanger for en måned:",
        type: "radio",
        options: [
          { value: "romcom", label: "Koselige romkomer" },
          { value: "thriller", label: "Mind-bending thrillere" },
          { value: "fantasy", label: "Fantasy/eventyr-epos" },
          { value: "trueCrime", label: "True crime-dokumentarer" },
        ],
      },
      {
        id: "bingeSeriesIdeal",
        text: "Din ideelle serie å binge har:",
        type: "radio",
        options: [
          { value: "emotionalConnection", label: "Karakterer du blir emosjonelt knyttet til" },
          { value: "plotTwists", label: "Plot twists som fucker med hodet ditt" },
          { value: "cinematography", label: "Vakker kinematografi/estetikk" },
          { value: "lolHumor", label: "Humor som får deg til å le høyt" },
        ],
      },
    ],
  },
  {
    id: "om-deg",
    name: "Tanker Om Deg",
    icon: "Heart",
    description: "Jeg fant dette parspillet på TikTok...",
    questions: [
      {
        id: "firstThoughtSeeingMe",
        text: "Hva er det første som popper opp i hodet ditt når du ser meg?",
        type: "radio",
        options: [
          { value: "safety", label: "Der er tryggheten min" },
          { value: "adventureTime", label: "Tid for eventyr" },
          { value: "favoriteDistraction", label: "Favoritdistraksjon min" },
          { value: "home", label: "Hjem" },
        ],
      },
      {
        id: "lastThoughtGoodbye",
        text: "Når vi sier hadet, er siste tanken din vanligvis:",
        type: "radio",
        options: [
          { value: "lookForwardNext", label: "Gleder meg til neste gang" },
          { value: "hopeNiceDay", label: "Håper de får en fin dag" },
          { value: "missAlready", label: "Savner allerede" },
          { value: "loveThatPerson", label: "Elsker det mennesket" },
        ],
      },
    ],
  },
  {
    id: "steder-tider",
    name: "Favorittsteder & Tider",
    icon: "MapPin",
    description: "Random spørsmålslek! Klar?",
    questions: [
      {
        id: "ultimateComfortPlace",
        text: "Ditt ultimate komfortsted er:",
        type: "radio",
        options: [
          { value: "bedGoodLighting", label: "Koselig i senga med god belysning" },
          { value: "cafeRightVibe", label: "Kafé med riktig vibe" },
          { value: "natureQuiet", label: "I naturen et stille sted" },
          { value: "anywhereHome", label: "Hvor som helst som føles som hjem" },
        ],
      },
      {
        id: "ourBestSpot",
        text: "Vårt beste spot sammen er:",
        type: "radio",
        options: [
          { value: "ourCafe", label: "Den ene kaféen vi alltid drar til" },
          { value: "drivingTalking", label: "Bare kjøre rundt og prate" },
          { value: "sofaBlanketUs", label: "Sofa + pledd + oss" },
          { value: "anywhereLaugh", label: "Hvor som helst vi kan le sammen" },
        ],
      },
      {
        id: "peakHappinessTime",
        text: "Peak lykke-tid på dagen?",
        type: "radio",
        options: [
          { value: "goldenHour", label: "Golden hour (soloppgang/solnedgang)" },
          { value: "lateNightTalks", label: "Sene nattsamtaler" },
          { value: "lateMorningVibes", label: "Late morgenvibes" },
          { value: "afternoonEnergy", label: "Ettermiddagsenergien" },
        ],
      },
    ],
  },
  {
    id: "matpreferanser",
    name: "Matpreferanser (Potettesten!)",
    icon: "Pizza",
    description: "Okei dette er weird men ranger disse potetrettene...",
    questions: [
      {
        id: "potatoRank",
        text: "Fra best til verst - vær ærlig!",
        type: "rank",
        rankOptions: ["Pommes frites", "Potetmos", "Bakt potet med topping", "Hash browns", "Potetgull"],
      },
      {
        id: "favoriteMealOfDay",
        text: "Favorittmåltidet på dagen er:",
        type: "radio",
        options: [
          { value: "breakfast", label: "Frokost - starte sterkt" },
          { value: "lunch", label: "Lunsj - midtdagsfuel" },
          { value: "dinner", label: "Middag - avslutte riktig" },
          { value: "snacks", label: "Snacks - den virkelige MVP-en" },
        ],
      },
    ],
  },
  {
    id: "minecraft",
    name: "Minecraft Intel",
    icon: "Gamepad2",
    description: "Jeg så på Minecraft-videoer og ble nysgjerrig...",
    questions: [
      {
        id: "minecraftFirstThing",
        text: "Første tingen du alltid gjør i en ny Minecraft-verden?",
        type: "radio",
        options: [
          { value: "sheepForBed", label: "Finne sau for seng umiddelbart" },
          { value: "digStraightDown", label: "Grave rett ned (kaos-modus)" },
          { value: "cuteStarterHouse", label: "Bygge et søtt starterhus" },
          { value: "explorePerfectSpot", label: "Utforske til jeg finner det perfekte stedet" },
        ],
      },
      {
        id: "minecraftMostAnnoying",
        text: "Mest irriterende ting i Minecraft?",
        type: "radio",
        options: [
          { value: "creepersDestroy", label: "Creepers som ødelegger byggene mine" },
          { value: "lostNoCoords", label: "Gå seg vill uten koordinater" },
          { value: "inventoryHell", label: "Inventory management helvete" },
          { value: "lavaDiamonds", label: "Falle i lava med diamanter" },
        ],
      },
    ],
  },
  {
    id: "friends",
    name: "Friends Rapid Fire",
    icon: "Tv2",
    description: "Okei jeg så denne Friends-quizen, bare si ja eller nei fort:",
    questions: [
      { id: "friendsRossRachel", text: "Ross og Rachel var meant to be?", type: "yesno" },
      { id: "friendsPhoebeFunniest", text: "Phoebe er den morsomste karakteren?", type: "yesno" },
      { id: "friendsJoeyBetterLove", text: "Joey fortjente bedre kjærlighetshistorier?", type: "yesno" },
      { id: "friendsMonicaControlling", text: "Monica var for kontrollerende?", type: "yesno" },
      { id: "friendsChandlerBestLines", text: "Chandler hadde de beste one-linersene?", type: "yesno" },
      { id: "friendsOnABreak", text: '"We were on a break" = Ross hadde rett?', type: "yesno" },
      { id: "friendsCentralPerkCozy", text: "Central Perk virker som et koselig sted?", type: "yesno" },
      { id: "friendsRachelJoey", text: "Rachel skulle endt opp med Joey?", type: "yesno" },
      { id: "friendsSmellyCatBanger", text: "Smelly Cat er faktisk en banger?", type: "yesno" },
      { id: "friendsCriedMovingOut", text: "Du gråt når de flyttet ut av leiligheten?", type: "yesno" },
    ],
  },
  {
    id: "bigmouth-general",
    name: "Big Mouth Speed Round",
    icon: "SmilePlus",
    description: "Random Big Mouth-spørsmål siden vi nettopp snakket om Netflix:",
    questions: [
      {
        id: "bmCharacter",
        text: "Hvis du var en karakter i Big Mouth, hvem ville du vært?",
        type: "radio",
        options: [
          { value: "nick", label: "Nick (sen bloomer, sarkastisk)" },
          { value: "andrew", label: "Andrew (awkward, overthinker)" },
          { value: "jessi", label: "Jessi (smart, kompleks)" },
          { value: "missy", label: "Missy (nerd, hjertevarm)" },
        ],
      },
      {
        id: "bmBestHormoneMonster",
        text: "Beste Hormone Monster?",
        type: "radio",
        options: [
          { value: "maurice", label: "Maurice (kaotisk energi)" },
          { value: "connie", label: "Connie (supportive queen)" },
          { value: "mona", label: "Mona (chill vibes)" },
          { value: "notSeenEnough", label: "Har ikke sett nok til å vite" },
        ],
      },
      {
        id: "bmRelatablePubertyStruggle",
        text: "Mest relaterbar pubertetsstruggle i serien?",
        type: "radio",
        options: [
          { value: "weirdBody", label: "Føle seg weird i egen kropp" },
          { value: "awkwardCrushes", label: "Awkward crushes" },
          { value: "parentsDontUnderstand", label: "Foreldre som ikke skjønner deg" },
          { value: "allAtOnce", label: "Alt samtidig" },
        ],
      },
      {
        id: "bmShameWizardFor",
        text: "Hvis du hadde en Shame Wizard, hva ville han shame deg for?",
        type: "radio",
        options: [
          { value: "procrastination", label: "Prokrastinering" },
          { value: "weirdGoogle", label: "Weird Google-søk" },
          { value: "cringeMemories", label: "Cringe minner fra ungdommen" },
          { value: "allAbove", label: "Alt det over" },
        ],
      },
      {
        id: "bmBestEpisodeConcept",
        text: "Beste Big Mouth-episode konsept?",
        type: "radio",
        options: [
          { value: "florida", label: "Florida-episoden" },
          { value: "valentines", label: "Valentinsdag-spesialen" },
          { value: "summerCamp", label: "Sommercampen" },
          { value: "disclosureMusical", label: "Disclosure the Musical" },
        ],
      },
    ],
  },
  {
    id: "bigmouth-body",
    name: "Big Mouth: Kropp & Selvbilde",
    icon: "PersonStanding",
    description: "Så denne Big Mouth-quizen om karakterutvikling...",
    questions: [
      {
        id: "bmRelatablePubertyExp",
        text: "Hvilken Big Mouth-karakter hadde mest relaterbar pubertetsopplevelse?",
        type: "radio",
        options: [
          { value: "nickLate", label: "Nick (alt skjedde sent, følte seg hengende etter)" },
          { value: "jessiSudden", label: "Jessi (alt kom brått og overveldende)" },
          { value: "andrewAwkward", label: "Andrew (awkward og overtenkte alt)" },
          { value: "missyChildhood", label: "Missy (prøvde å holde på barndommen)" },
        ],
      },
      {
        id: "bmHormoneMonsterYouth",
        text: "Hvis du hadde en Hormone Monster i ungdommen, hva ville de sagt oftest?",
        type: "radio",
        options: [
          { value: "notReady", label: "Du er ikke klar for dette ennå" },
          { value: "allWatching", label: "Alle ser på deg, act normal!" },
          { value: "tryWhatOthersDo", label: "Du burde prøve det alle andre gjør" },
          { value: "embraceChaos", label: "Embrace the chaos, baby!" },
        ],
      },
      {
        id: "bmAwkwardPubertyMemory",
        text: "Mest awkward pubertetsminne du relaterer til fra serien?",
        type: "radio",
        options: [
          { value: "bodyChangedPace", label: "Kroppen endret seg fortere/saktere enn andres" },
          { value: "firstCrushWrong", label: "Første crush som gikk helt galt" },
          { value: "parentsInvolved", label: "Foreldre som var for involvert/ikke involvert nok" },
          { value: "friendDramaEndWorld", label: "Venne-drama som føltes som verdens undergang" },
        ],
      },
      {
        id: "bmGinaStoryline",
        text: "Gina's storyline om tidlig utvikling - thoughts?",
        type: "radio",
        options: [
          { value: "relatedHard", label: "Relaterte hardt, oppmerksomhet sucks" },
          { value: "feltOpposite", label: "Følte meg motsatt - sent utviklet" },
          { value: "otherWorries", label: "Mer bekymret for andre ting enn kropp" },
          { value: "gladEscapedAttention", label: "Glad jeg slapp den typen oppmerksomhet" },
        ],
      },
      {
        id: "bmKoreanSpaEpisode",
        text: "Korean spa-episoden hvor de aksepterer kroppene sine - din reaksjon?",
        type: "radio",
        options: [
          { value: "tearsNeededMessage", label: "Tårer, trengte å høre det budskapet" },
          { value: "uncomfortableImportant", label: "Gjorde meg ukomfortabel men important" },
          { value: "wishYounger", label: "Wish jeg hadde sett dette som yngre" },
          { value: "stillWorkingBodyAcceptance", label: "Fortsatt working on body acceptance" },
        ],
      },
    ],
  },
  {
    id: "bigmouth-mental",
    name: "Big Mouth: Mental Helse & Følelser",
    icon: "Brain",
    description: "Big Mouth's mental health karakterer - hvem treffer mest?",
    questions: [
      {
        id: "bmDepressionKittyVisit",
        text: "Hvis Depression Kitty besøkte deg, hva ville hun sagt?",
        type: "radio",
        options: [
          { value: "whyBother", label: "Hvorfor gidde når ingenting matters?" },
          { value: "notGoodEnough", label: "Du er ikke good enough uansett" },
          { value: "stayInBed", label: "Bare bli i sengen, verden venter" },
          { value: "noOneUnderstands", label: "Ingen forstår deg virkelig" },
        ],
      },
      {
        id: "bmTitoAnxietyWorry",
        text: "Tito the Anxiety Mosquito's go-to bekymring for deg?",
        type: "radio",
        options: [
          { value: "allHateYou", label: "Hva hvis alle secretly hater deg?" },
          { value: "youWillFuckUp", label: "Du kommer til å fucke opp dette" },
          { value: "allJudging", label: "Alle dømmer hver eneste ting du gjør" },
          { value: "somethingTerrible", label: "Something terrible er rett rundt hjørnet" },
        ],
      },
      {
        id: "bmHandleMentalHealthBest",
        text: "Hvordan håndterer karakterene mental health best?",
        type: "radio",
        options: [
          { value: "jessiTherapy", label: "Jessi's terapi og åpenhet" },
          { value: "nickFriendSupport", label: "Nick's vennestøtte" },
          { value: "missySelfCare", label: "Missy's self-care rutiner" },
          { value: "andrewCoping", label: "Andrew's (dårlige) coping mechanisms" },
        ],
      },
      {
        id: "bmShameWizardAppear",
        text: "Din 'Shame Wizard' ville dukket opp mest for?",
        type: "radio",
        options: [
          { value: "oldEmbarrassingMemories", label: "Gamle pinlige minner som haunter meg" },
          { value: "thingsSaidRelationships", label: "Ting jeg sa/gjorde i relationships" },
          { value: "bodyInsecurities", label: "Kropps-relaterte insecurities" },
          { value: "notLivingUpExpectations", label: "Ikke leve opp til expectations" },
        ],
      },
      {
        id: "bmGratitoadGrateful",
        text: "Gratitoad (takknemlighetspaddden) - hva ville du faktisk vært grateful for?",
        type: "radio",
        options: [
          { value: "supportivePeople", label: "Støttende mennesker rundt meg" },
          { value: "grownFromInsecurities", label: "Vokst fra gamle insecurities" },
          { value: "smallJoys", label: "Små gleder som holder meg gående" },
          { value: "teenageYearsOver", label: "At teenage years er over tbh" },
        ],
      },
    ],
  },
  {
    id: "bigmouth-relations",
    name: "Big Mouth: Relasjoner & Seksualitet",
    icon: "Users",
    description: "Big Mouth's relationship dynamics - spicy questions incoming...",
    questions: [
      {
        id: "bmAccurateFirstCrush",
        text: "Mest accurate framstilling av first crush?",
        type: "radio",
        options: [
          { value: "nickJessiAwkward", label: "Nick & Jessi's awkward vennskap-til-mer" },
          { value: "andrewObsession", label: "Andrew's intense obsession vibes" },
          { value: "missyFantasyReality", label: "Missy's fantasier vs reality" },
          { value: "matthewDifferent", label: "Matthew's navigering av being different" },
        ],
      },
      {
        id: "bmConsentEpisode",
        text: "Consent-episoden ('The Head Push') - hvilken del traff hardest?",
        type: "radio",
        options: [
          { value: "pressureNotReady", label: "Presset om å gjøre ting du ikke er klar for" },
          { value: "dontKnowSayNo", label: "Ikke vite hvordan å si nei" },
          { value: "whatAllSayVsReality", label: "Forskjellen mellom hva alle sier vs virkeligheten" },
          { value: "okTakeSlow", label: "Lære at det er OK å ta det sakte" },
        ],
      },
      {
        id: "bmLovebugWalterPush",
        text: "Hvis du hadde en Lovebug som Walter, hva ville de pushet?",
        type: "radio",
        options: [
          { value: "deserveAdventure", label: "Du fortjener eventyr og excitement!" },
          { value: "safetyComfortImportant", label: "Trygghet og comfort er det viktigste" },
          { value: "dontSettleAimHigher", label: "Ikke settle, aim higher!" },
          { value: "stopOverthinkFeel", label: "Slutt å overthink, just feel!" },
        ],
      },
      {
        id: "bmRelationshipDynamicYou",
        text: "Hvilken Big Mouth-relationship dynamic er mest deg?",
        type: "radio",
        options: [
          { value: "intensePassionate", label: "Intense og passionate (Jessi & Michael Angelo)" },
          { value: "bestFriendsFirst", label: "Beste venner først (Nick & Jessi)" },
          { value: "oppositesAttract", label: "Opposites attract (Jay & Lola)" },
          { value: "slowSupportive", label: "Sakte og støttende (Missy & DeVon)" },
        ],
      },
    ],
  },
  {
    id: "bigmouth-growth",
    name: "Big Mouth: Personlig Vekst & Identitet",
    icon: "Leaf",
    description: "Character development through sesongene...",
    questions: [
      {
        id: "bmMissyIdentityJourney",
        text: "Missy's identitetsreise - mest relatable del?",
        type: "radio",
        options: [
          { value: "whoAmIOutsideParents", label: "Finne ut hvem du er utenfor foreldres påvirkning" },
          { value: "discoverNewSides", label: "Oppdage nye sider av deg selv" },
          { value: "navigateMultipleIdentities", label: "Navigere flere identiteter samtidig" },
          { value: "growIntoPower", label: "Vokse inn i din egen power" },
        ],
      },
      {
        id: "bmLifeEpisodeTitle",
        text: "Hvis livet ditt var en Big Mouth-episode, hva ville tittelen vært?",
        type: "radio",
        options: [
          { value: "overthinkersDilemma", label: "The Overthinker's Dilemma" },
          { value: "comfortZoneHome", label: "Comfort Zone Is My Home" },
          { value: "fakeItTillNope", label: "Fake It Till You... Nope" },
          { value: "characterDevLoading", label: "Character Development Loading..." },
        ],
      },
      {
        id: "bmCharacterGrowthArcMatch",
        text: "Hvilken karakter's growth arc matcher din mest?",
        type: "radio",
        options: [
          { value: "jessiBigEmotions", label: "Jessi - lære å håndtere big emotions" },
          { value: "nickOwnTimeline", label: "Nick - akseptere din egen timeline" },
          { value: "missyEmbraceAllParts", label: "Missy - embrace alle delene av deg" },
          { value: "andrewBalanceImpulses", label: "Andrew - finne balanse mellom impulser og kontroll" },
        ],
      },
    ],
  },
  {
    id: "bigmouth-social",
    name: "Big Mouth: Sosiale Situasjoner & Anxiety",
    icon: "MessageSquare",
    description: "Big Mouth's awkward moments...",
    questions: [
      {
        id: "bmWorstSocialNightmare",
        text: "Verste sosiale nightmare fra serien som kunne skjedd deg?",
        type: "radio",
        options: [
          { value: "parentsEmbarrass", label: "Foreldre som embarrasser deg foran crush" },
          { value: "everyoneKnowsSecret", label: "Alle vet en hemmelighet om deg" },
          { value: "physicalAccidentSchool", label: "Fysisk uhell foran hele skolen" },
          { value: "friendBetrayalPublic", label: "Venne-betrayal på offentlig sted" },
        ],
      },
      {
        id: "bmAwkwardSituationStrategy",
        text: "Din go-to strategi i awkward situasjoner?",
        type: "radio",
        options: [
          { value: "andrewOvercompensate", label: "Andrew's overdreven kompensering" },
          { value: "nickSmoothFail", label: "Nick's prøve-å-være-smooth-men-fail" },
          { value: "jessiFuckIt", label: 'Jessi\'s "fuck it" attitude' },
          { value: "missyHyperanalyze", label: "Missy's hyperanalysering" },
        ],
      },
      {
        id: "bmCafeteriaHierarchy",
        text: "Cafeteria-hierarkiet - hvor var du?",
        type: "radio",
        options: [
          { value: "desperateFitIn", label: "Prøvde desperat å passe inn" },
          { value: "smallSafeGroup", label: "Hadde min lille trygge gruppe" },
          { value: "floatedCrowds", label: "Floated mellom forskjellige crowds" },
          { value: "avoidedWholeThing", label: "Actively avoided hele greia" },
        ],
      },
    ],
  },
  {
    id: "bigmouth-emotional-status",
    name: "Big Mouth: Nåværende Emosjonell Status",
    icon: "Activity",
    description: "Quick fire Big Mouth therapy session...",
    questions: [
      {
        id: "bmFeelingsMSG",
        text: "Hvis alle dine følelser var i Madison Square Garden (som i serien), hvem ville vært på scenen nå?",
        type: "radio",
        options: [
          { value: "anxietyTakesShow", label: "Anxiety tar hele showet" },
          { value: "depressionLurks", label: "Depression lurker backstage" },
          { value: "joyTriesBest", label: "Joy prøver sitt beste" },
          { value: "fullChaosMicFight", label: "Det er full kaos, alle kjemper om mic'en" },
        ],
      },
      {
        id: "bmCurrentInnerVoice",
        text: "Din nåværende 'inner voice' er mest som?",
        type: "radio",
        options: [
          { value: "supportiveHormoneMonster", label: "Supportive Hormone Monster" },
          { value: "criticalShameWizard", label: "Kritisk Shame Wizard" },
          { value: "worriedTito", label: "Worried Tito" },
          { value: "chillLovebug", label: "Chill Lovebug vibes" },
        ],
      },
      {
        id: "bmInnerTeenagerNeedsToHear",
        text: "Hva trenger din 'inner teenager' å høre akkurat nå?",
        type: "radio",
        options: [
          { value: "didBestKnewThen", label: "Du gjorde ditt beste med det du visste da" },
          { value: "mostDontRememberEmbarrassing", label: "De fleste husker ikke dine pinlige øyeblikk" },
          { value: "grownMoreThanThink", label: "Du har vokst mer enn du tror" },
          { value: "itGetsBetter", label: "Det blir faktisk bedre" },
        ],
      },
    ],
  },
]
