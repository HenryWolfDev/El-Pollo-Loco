class MyAudio {
  sound;
  loaded = false;

  constructor(_sound) {
    this.sound = new Audio(_sound);
  }
}

export class AudioHub {
  // #region Audio-Files
  static Character_Damage = new MyAudio(
    "../assets/sounds/character/characterDamage.mp3"
  );
  static Character_Dead = new MyAudio(
    "../assets/sounds/character/characterDead.wav"
  );
  static Character_Jump = new MyAudio(
    "../assets/sounds/character/characterJump.mp3"
  );

  static Character_Walk = new MyAudio(
    "../assets/sounds/character/characterRun2.mp3"
  );
  static Character_Snoring = new MyAudio(
    "../assets/sounds/character/characterSnoring.mp3"
  );

  //Chicken
  static Chicken_Dead = new MyAudio("../assets/sounds/chicken/chickenDead.mp3");
  static Chicken_Dead2 = new MyAudio(
    "../assets/sounds/chicken/chickenDead2.mp3"
  );
  static Chicken_Voice = new MyAudio(
    "../assets/sounds/chicken/chickenVoice2.mp3"
  );

  //Collectibles
  static Bottle_Collect = new MyAudio(
    "../assets/sounds/collectibles/bottleCollectSound.wav"
  );
  static Collect_Sound = new MyAudio(
    "../assets/sounds/collectibles/collectSound.mp3"
  );

  //Endboss
  static Endboss = new MyAudio("../assets/sounds/endboss/endbossApproach.wav");

  //Game
  static Game_Start = new MyAudio("../assets/sounds/game/gameStart.mp3");

  //Throwable
  static Bottle_Break = new MyAudio(
    "../assets/sounds/throwable/bottleBreak.mp3"
  );

  static Winning = new MyAudio("../assets/sounds/game/winning.mp3");

  static Background = new MyAudio("../assets/sounds/game/background2.mp3");
  static Wind = new MyAudio("../assets/sounds/game/wind2.mp3");

  // All Sounds
  static allSounds = [
    AudioHub.Character_Dead,
    AudioHub.Character_Jump,
    AudioHub.Character_Walk,
    AudioHub.Character_Snoring,
    AudioHub.Chicken_Dead,
    AudioHub.Chicken_Dead2,
    AudioHub.Chicken_Voice,
    AudioHub.Bottle_Collect,
    AudioHub.Collect_Sound,
    AudioHub.Endboss,
    AudioHub.Game_Start,
    AudioHub.Bottle_Break,
    AudioHub.Winning,
    AudioHub.Background,
    AudioHub.Wind,
  ];
  // #endregion Audio-Files
  static playOne(sound) {
    if (sound.sound.readyState === 4 || sound.loaded) {
      sound.loaded = true;
      sound.sound.volume = vol;
      sound.sound.currentTime = 0;
      sound.sound.play();
    }
  }

  static stopAll() {
    AudioHub.allSounds.forEach((sound) => {
      sound.sound.pause();
    });
  }

  static stopOne(sound) {
    sound.sound.pause();
  }
}
