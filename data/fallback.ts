import { Book, DailyVerse } from '../types/bible';

export const FALLBACK_DAILY_VERSES: DailyVerse[] = [
  {
    book: 'Jean', bookId: 43, chapter: 3, verse: 16,
    text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    reference: 'Jean 3:16',
  },
  {
    book: 'Psaumes', bookId: 19, chapter: 23, verse: 1,
    text: "L'Éternel est mon berger : je ne manquerai de rien. Il me fait reposer dans de verts pâturages, il me dirige près des eaux paisibles.",
    reference: 'Psaumes 23:1-2',
  },
  {
    book: 'Philippiens', bookId: 50, chapter: 4, verse: 13,
    text: "Je puis tout par celui qui me fortifie.",
    reference: 'Philippiens 4:13',
  },
  {
    book: 'Matthieu', bookId: 40, chapter: 6, verse: 33,
    text: "Cherchez premièrement le royaume et la justice de Dieu ; et toutes ces choses vous seront données par-dessus.",
    reference: 'Matthieu 6:33',
  },
  {
    book: 'Jérémie', bookId: 24, chapter: 29, verse: 11,
    text: "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.",
    reference: 'Jérémie 29:11',
  },
  {
    book: 'Romains', bookId: 45, chapter: 8, verse: 28,
    text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.",
    reference: 'Romains 8:28',
  },
  {
    book: 'Proverbes', bookId: 18, chapter: 3, verse: 5,
    text: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse ; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.",
    reference: 'Proverbes 3:5-6',
  },
];

export const DEMO_BIBLE: Book[] = [
  {
    id: 1, name: 'Genèse', abbreviation: 'Gen', testament: 'AT', category: 'Pentateuque',
    chapters: [
      {
        chapter: 1, verses: [
          { verse: 1, text: "Au commencement, Dieu créa les cieux et la terre." },
          { verse: 2, text: "La terre était informe et vide : il y avait des ténèbres à la surface de l'abîme, et l'Esprit de Dieu se mouvait au-dessus des eaux." },
          { verse: 3, text: "Dieu dit : Que la lumière soit ! Et la lumière fut." },
          { verse: 4, text: "Dieu vit que la lumière était bonne ; et Dieu sépara la lumière d'avec les ténèbres." },
          { verse: 5, text: "Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin : ce fut le premier jour." },
          { verse: 6, text: "Dieu dit : Qu'il y ait une étendue entre les eaux, et qu'elle sépare les eaux d'avec les eaux." },
          { verse: 7, text: "Et Dieu fit l'étendue, et il sépara les eaux qui sont au-dessous de l'étendue d'avec les eaux qui sont au-dessus de l'étendue. Et cela fut ainsi." },
          { verse: 8, text: "Dieu appela l'étendue ciel. Ainsi, il y eut un soir, et il y eut un matin : ce fut le second jour." },
          { verse: 26, text: "Puis Dieu dit : Faisons l'homme à notre image, selon notre ressemblance, et qu'il domine sur les poissons de la mer, sur les oiseaux du ciel, sur le bétail, sur toute la terre, et sur tous les reptiles qui rampent sur la terre." },
          { verse: 27, text: "Dieu créa l'homme à son image, il le créa à l'image de Dieu, il créa l'homme et la femme." },
        ]
      }
    ]
  },
  {
    id: 19, name: 'Psaumes', abbreviation: 'Ps', testament: 'AT', category: 'Livres poétiques',
    chapters: [
      {
        chapter: 23, verses: [
          { verse: 1, text: "L'Éternel est mon berger : je ne manquerai de rien." },
          { verse: 2, text: "Il me fait reposer dans de verts pâturages, il me dirige près des eaux paisibles." },
          { verse: 3, text: "Il restaure mon âme, il me conduit dans les sentiers de la justice, à cause de son nom." },
          { verse: 4, text: "Quand je marche dans la vallée de l'ombre de la mort, je ne crains aucun mal, car tu es avec moi : ta houlette et ton bâton me rassurent." },
          { verse: 5, text: "Tu dresses devant moi une table, en face de mes adversaires ; tu oins d'huile ma tête, et ma coupe déborde." },
          { verse: 6, text: "Oui, le bonheur et la grâce m'accompagneront tous les jours de ma vie, et j'habiterai dans la maison de l'Éternel jusqu'à la fin de mes jours." },
        ]
      },
      {
        chapter: 91, verses: [
          { verse: 1, text: "Celui qui demeure sous l'abri du Très Haut repose à l'ombre du Tout Puissant." },
          { verse: 2, text: "Je dis à l'Éternel : Mon refuge et ma forteresse, mon Dieu en qui je me confie !" },
          { verse: 4, text: "Il te couvrira de ses plumes, et tu trouveras un refuge sous ses ailes ; sa fidélité est un bouclier et une cuirasse." },
          { verse: 11, text: "Car il ordonnera à ses anges de te garder dans toutes tes voies." },
        ]
      }
    ]
  },
  {
    id: 40, name: 'Matthieu', abbreviation: 'Mt', testament: 'NT', category: 'Évangiles',
    chapters: [
      {
        chapter: 5, verses: [
          { verse: 3, text: "Heureux les pauvres en esprit, car le royaume des cieux est à eux !" },
          { verse: 4, text: "Heureux ceux qui pleurent, car ils seront consolés !" },
          { verse: 5, text: "Heureux les débonnaires, car ils hériteront la terre !" },
          { verse: 6, text: "Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés !" },
          { verse: 7, text: "Heureux les miséricordieux, car ils obtiendront miséricorde !" },
          { verse: 8, text: "Heureux ceux qui ont le cœur pur, car ils verront Dieu !" },
          { verse: 9, text: "Heureux ceux qui procurent la paix, car ils seront appelés fils de Dieu !" },
        ]
      },
      {
        chapter: 6, verses: [
          { verse: 9, text: "Voici donc comment vous devez prier : Notre Père qui es aux cieux ! Que ton nom soit sanctifié ;" },
          { verse: 10, text: "que ton règne vienne ; que ta volonté soit faite sur la terre comme au ciel." },
          { verse: 11, text: "Donne-nous aujourd'hui notre pain quotidien ;" },
          { verse: 12, text: "pardonne-nous nos offenses, comme nous aussi nous pardonnons à ceux qui nous ont offensés ;" },
          { verse: 33, text: "Cherchez premièrement le royaume et la justice de Dieu ; et toutes ces choses vous seront données par-dessus." },
        ]
      }
    ]
  },
  {
    id: 43, name: 'Jean', abbreviation: 'Jn', testament: 'NT', category: 'Évangiles',
    chapters: [
      {
        chapter: 1, verses: [
          { verse: 1, text: "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu." },
          { verse: 2, text: "Elle était au commencement avec Dieu." },
          { verse: 3, text: "Toutes choses ont été faites par elle, et rien de ce qui a été fait n'a été fait sans elle." },
          { verse: 14, text: "Et la Parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité ; et nous avons contemplé sa gloire, une gloire comme la gloire du Fils unique venu du Père." },
        ]
      },
      {
        chapter: 3, verses: [
          { verse: 16, text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." },
          { verse: 17, text: "Dieu, en effet, n'a pas envoyé son Fils dans le monde pour qu'il juge le monde, mais pour que le monde soit sauvé par lui." },
        ]
      }
    ]
  },
  {
    id: 45, name: 'Romains', abbreviation: 'Ro', testament: 'NT', category: 'Épîtres de Paul',
    chapters: [
      {
        chapter: 8, verses: [
          { verse: 1, text: "Il n'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ." },
          { verse: 28, text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein." },
          { verse: 38, text: "Car j'ai l'assurance que ni la mort ni la vie, ni les anges ni les dominations, ni les choses présentes ni les choses à venir, ni les puissances," },
          { verse: 39, text: "ni la hauteur, ni la profondeur, ni aucune autre créature ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur." },
        ]
      }
    ]
  },
];
