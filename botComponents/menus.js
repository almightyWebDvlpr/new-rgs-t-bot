const mainMenuKeyboard = [
  ["📝 Запит на навчання", "🆘 Запит технічної допомоги"],
  [
    // "⚡ Вправи", 
  
  "📖 Інструкції"],
  ["☎️ Контакт служби підтримки", "ℹ️ Корисна інформація"],
  ["❌ Закрити меню"],
];

const instructionsMenuKeyboard = [
  ["🩺💻 Інструкція для кабінету лікаря"],
  ["🧑🏻‍⚕️💻 Інструкція для кабінету пацієнта до пк"],
  ["🧑🏻‍⚕️📱 Інструкція для пацієнта до мобільного пристрою"],
  ["⬅️ Повернутися до головного меню"],
];

const infoMenuKeyboard = [
  ["⚖️ Законодавство"],
  ["▶️ Youtube канал", "🎓 Майстер-класи"],
  ["⬅️ Повернутися до головного меню"],
];

const exercisesMenuKeyboard = [
  ["Хвороба Альцгеймера", "Атаксія"],
  ["Дитячий церебральний параліч", "Розсіяний склероз"],
  ["Хвороба Паркінсона", "Інсульт"],
  ["Травма спинного мозку", "Черепно-мозкова травма"],
  ["⬅️ Повернутися до головного меню"],
];

const trainingEcercisesMobile = [
  {
    name: "Пам'яті послідовність",
    description: "Від користувача вимагається торкатися об'єктів пальцем відповідно до інструкцій. У деяких випадках необхідно доторкнутися до об'єктів, які збігаються або відрізняються від еталонного, або належать або не належать до категорії, зазначеної у верхній частині. В інших випадках користувачеві потрібно вибрати об’єкти на основі їхнього розміру або повторити послідовність вибору об’єктів у певному порядку.",
    diagnosis: [""],
    cognitive_function:"",
    img_url: "./files/memory.png",
  },
  {
    name: "Розмістіть об'єкти",
    description: "Користувач повинен розмістити об'єкт у відповідних формах. Щоб зробити це, ви повинні виконати жест «щипнути», одночасно торкаючись екрана великим і вказівним пальцями, щоб перетягнути їх до силуетів однакової форми.",
    diagnosis: [""],
    cognitive_function:"",
    img_url: "./files/place_to.png",
  },
  {
    name: "Вгадай що?",
    description: "Користувачеві потрібно відгадати предмети або слова відповідно до інструкцій. Для цього мобільний телефон потрібно спирати на стіл або плоску поверхню, або його також можна тримати однією рукою, тоді як іншою будуть об’єкти або слова об’єкта, який потрібно відгадати, у центрі екрана. вибрані, відповідно до підказок.",
    diagnosis: [""],
    cognitive_function:"пам'ять, зорово-просторова обробка, ротація образу та мови для виявлення семантичних категорій",
    img_url: "./files/guess_what.png",
  },
  {
    name: "Піано-послідовність",
    description: "Від користувача вимагається відтворення музичних фрагментів. Для цього мобільний потрібно спирати на стіл або рівну поверхню, або ж його можна тримати однією рукою, а іншою натискати на клавіші піаніно. Спочатку користувач повинен послухати мелодію і поспостерігати, які клавіші підсвічуються, щоб потім відтворити ту ж послідовність.",
    diagnosis: [""],
    cognitive_function: 'стійка увага, просторова увага, робоча пам`ять',
    img_url: "./files/piano.png",
  },
  {
    name: "Краплі",
    description: "Від користувача вимагається отримати геометричну фігуру того ж розміру та кольору, що й еталон у верхній частині екрана. Для цього користувач повинен одночасно торкнутися екрана великим і вказівним пальцями, роблячи «щипки», щоб з’єднати або розділити елементи відповідно до кольору та кількості фігур.",
    diagnosis: [""],
    cognitive_function:"Виконавча функція (планування дій), і координація послідовності цілеспрямованих рухів",
    img_url: "./files/drops.png",
  },
  {
    name: "Покупки",
    description: "Користувачеві потрібно зібрати предмети за допомогою кошика відповідно до інструкцій. Для цього мобільний телефон потрібно поставити на стіл або плоску поверхню, а потім перемістити мобільний телефон вгору або вниз, щоб перемістити кошик, щоб забрати предмети. В одних випадках від користувача вимагається збирати об’єкти в певному порядку, в інших потрібно зібрати один тип об’єктів певну кількість разів, а також об’єкти, які належать до вказаної категорії.",
    diagnosis: [""],
    cognitive_function:"",
    img_url: "./files/shopping.png",
  },
  {
    name: "Прибирання",
    description: "Від користувача вимагається пальцями рухати губку, щоб очистити поверхню демонстрованого об’єкта.",
    diagnosis: [""],
    cognitive_function:"",
    img_url: "./files/cleaning.png",
  },
  {
    name: "Арманоід",
    description: "Гра, натхненна арканоїдом. Користувачеві потрібно розбити кольорові кубики. Для цього вони повинні тримати мобільний однією рукою і тримати його горизонтально (перпендикулярно до землі). За допомогою рухів пронації та супінації штанга рухається, що дозволяє користувачеві направляти м’яч, щоб дістатися до кубиків і розбити їх.",
    diagnosis: [""],
    cognitive_function:"",
    img_url: "./files/armanoid.png",
  },
  {
    name: "Водіння",
    description: "Щоб керувати автомобілем і збирати бали, уникаючи перешкод, користувачеві потрібно тримати телефон обома руками і обертати його так, ніби це кермо.",
    diagnosis: [""],
    cognitive_function:"виконавча функція, планування дії, перешкода уникнення та координація послідовності цілеспрямованих руху.",
    img_url: "./files/driving.png",
  },
  {
    name: "Навчання AR",
    description: "Користувач повинен шукати та досягати об'єктів, які з'являються попереду. Для цього вони повинні взяти мобільний однією або двома руками і наблизити мобільний, поки не дістануться до предметів.",
    diagnosis: [""],
    cognitive_function:"",
    img_url: "./files/training_ar.png",
  },
  {
    name: "Полиці AR",
    description: "Від користувача вимагається шукати і досягати об'єктів, зазначених в інструкції. Для цього вони повинні взяти мобільний однією або двома руками, шукати предмети через екран і наближати мобільний до тих пір, поки не досягнуть предметів зазначеної категорії.",
    diagnosis: [""],
    cognitive_function:"",
    img_url: "./files/shelves.png",
  },
  {
    name: "Буфет AR",
    description: "Користувач зобов'язаний взяти їжу, зазначену на харчовій стрічці. Для цього вони повинні взяти мобільний телефон однією або двома руками і наблизити його до вказаних продуктів, щоб взяти їх рукою. Прийнявши кожну страву, її потрібно залишити в мисці.",
    diagnosis: [""],
    cognitive_function:"",
    img_url: "./files/buffet_ar.png",
  },
  {
    name: "Алфавіт AR",
    description: "Користувачеві потрібно розбити сині кубики, які утворюють букви алфавіту, водяним пістолетом. Для цього вони повинні взяти мобільний телефон однією або обома руками, щоб прицілитися і стріляти в кольорові кубики, щоб розбити їх. Щоб виконати цю дію, користувач має помірно витягнути руку, інакше ціль стане червоною, а кубики не можна розбити, доки користувач знову не витягне руку.",
    diagnosis: [ "Атаксія"],
    cognitive_function:"вибіркова увага, оперативна пам'ять, простір і координація послідовності цілеспрям руху.",
    img_url: "./files/alphabet.png",
  },
  {
    name: "Повітряні кулі AR",
    description: "Від користувача вимагається лопнути кульки кольору, зазначеного в інструкції. Для цього вони повинні взяти мобільний телефон однією або обома руками і наблизити мобільний телефон до тих пір, поки не досягнуть повітряні кульки потрібного кольору, щоб дротик їх розірвав.",
    diagnosis:["Хвороба Альцгеймера", "Атаксія"],
    cognitive_function:"Виконавча функція, планування дії, простір і координація послідовності цілеспрямованих рухів.",
    img_url: "./files/clouds.png",
  },
  {
    name: "Качки AR",
    description: "Від користувача вимагається зловити гумових качечок того кольору, який вказаний в інструкції. Для цього вони повинні взяти мобіль однією або обома руками і посунути його, щоб знайти качок, і піднести мобіль ближче, поки вони не дістануться до них і не виловлять їх вудкою. Зловивши качку, її необхідно залишити у відрах, розташованих поруч з водоймою.",
    diagnosis: ["Хвороба Альцгеймера", "Атаксія"],
    cognitive_function:"Зорове та просторове усвідомлення, виконавча функція, планування дії, координація послідовності цільових орієнтовані рухи.",
    img_url: "./files/ducks.png",
  }
];

const trainingEcercisesMobiles = [
  {
    name: "Пам'яті послідовність",
    description: "",
    diagnosis: ["Хвороба Альцгеймера", "Атаксія"],
    img_url: "./files/memory.png",
    ognitive_function:""
  },
  {
    name: "Розмістіть об'єкти",
    description: "",
    diagnosis: ["Хвороба Альцгеймера", "Атаксія"],
    img_url: "./files/memory.png",
    ognitive_function:""
  },]

module.exports = {
  mainMenuKeyboard,
  instructionsMenuKeyboard,
  infoMenuKeyboard,
  exercisesMenuKeyboard,
  trainingEcercisesMobile
};
