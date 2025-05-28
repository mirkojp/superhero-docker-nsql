const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Superhero = require('./models/Superhero');

const seedHeroes = async (force = false) => {
  try {
    // Check if the database already has superheroes
    const count = await Superhero.countDocuments();
    if (count > 0 && !force) {
      console.log(`Database already has ${count} superheroes. Skipping seeding. Use force=true to override.`);
      return;
    }

    // Drop the existing collection if force is true or database is empty
    if (force || count === 0) {
      await Superhero.deleteMany({});
      console.log('Cleared existing superheroes for reseeding...');
    }

    // Read images
    const imageDir = path.join(__dirname, 'images');
    const imageData = await fs.readFile(path.join(imageDir, 'image.jpg'));
    const image2Data = await fs.readFile(path.join(imageDir, 'image-2.jpg'));
    const blackwidow1Data = await fs.readFile(path.join(imageDir, 'blackwidow-1.jpg'));
    const captainamerica1Data = await fs.readFile(path.join(imageDir, 'captainamerica-1.jpg'));
    const hulk1Data = await fs.readFile(path.join(imageDir, 'hulk-1.jpg'));
    const ironman1Data = await fs.readFile(path.join(imageDir, 'ironman-1.jpg'));
    const ironman2Data = await fs.readFile(path.join(imageDir, 'ironman-2.jpg'));
    const spiderman1Data = await fs.readFile(path.join(imageDir, 'spiderman-1.jpg'));
    const thor1Data = await fs.readFile(path.join(imageDir, 'thor-1.jpg'));

    const superheroes = [
      {
        name: 'Spider-Man',
        realName: 'Peter Parker',
        house: 'Marvel',
        biography: 'Bitten by a radioactive spider during a school field trip, Peter Parker, a nerdy high school student, gains incredible superpowers including enhanced strength, agility, and the ability to cling to walls. After the tragic death of his Uncle Ben, he learns that with great power comes great responsibility, leading him to become the web-slinging hero of New York City, balancing his dual life as a photographer and crime-fighter.',
        abilities: ['Web-slinging', 'Wall-crawling', 'Super strength'],
        images: [
          { data: spiderman1Data, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' },
          { data: imageData, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1962
      },
      {
        name: 'Iron Man',
        realName: 'Tony Stark',
        house: 'Marvel',
        biography: 'A billionaire industrialist and genius inventor, Tony Stark is captured by terrorists who force him to build a weapon. Instead, he constructs a powered suit of armor to escape, sparking his transformation into Iron Man. Returning to the U.S., he refines the suit, using it to fight evil while managing his company, Stark Industries, and dealing with personal demons like alcoholism and hubris.',
        abilities: ['Genius intellect', 'Flight', 'Repulsors'],
        images: [
          { data: ironman1Data, contentType: 'image/jpeg' },
          { data: ironman2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1963
      },
      {
        name: 'Thor',
        realName: 'Thor Odinson',
        house: 'Marvel',
        biography: 'The Norse god of thunder, Thor is banished to Earth by his father Odin as a lesson in humility, stripped of his hammer Mjolnir until he proves worthy. On Earth, he falls in love with a human scientist, battles ancient enemies like Loki, and learns to balance his divine duties with his new mortal experiences, wielding lightning and strength to protect both realms.',
        abilities: ['Thunder control', 'Super strength', 'Flight'],
        images: [
          { data: thor1Data, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1962
      },
      {
        name: 'Hulk',
        realName: 'Bruce Banner',
        house: 'Marvel',
        biography: 'A brilliant scientist, Bruce Banner is accidentally exposed to gamma radiation during an experiment, transforming him into the Hulk, a green-skinned behemoth of rage and power. Struggling to control his transformations, he becomes a fugitive, sought by the military, while seeking a cure and using his strength to occasionally save the world from greater threats.',
        abilities: ['Super strength', 'Healing factor'],
        images: [{ data: hulk1Data, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1962
      },
      {
        name: 'Captain America',
        realName: 'Steve Rogers',
        house: 'Marvel',
        biography: 'A frail young man enhanced to the peak of human perfection by an experimental super-soldier serum, Steve Rogers becomes Captain America during World War II. Frozen in ice for decades, he awakens in the modern era to lead the Avengers, wielding his iconic vibranium shield to fight for justice and liberty against all odds.',
        abilities: ['Super strength', 'Agility', 'Leadership'],
        images: [
          { data: captainamerica1Data, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1941
      },
      {
        name: 'Black Widow',
        realName: 'Natasha Romanoff',
        house: 'Marvel',
        biography: 'Trained from a young age by the Soviet KGB to become a deadly assassin, Natasha Romanoff defects to S.H.I.E.L.D., becoming Black Widow. With exceptional combat skills, espionage expertise, and a complex past, she works to atone for her sins, joining the Avengers and navigating a world of espionage and betrayal with grace and determination.',
        abilities: ['Espionage', 'Martial arts'],
        images: [{ data: blackwidow1Data, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1964
      },
      {
        name: 'Doctor Strange',
        realName: 'Stephen Strange',
        house: 'Marvel',
        biography: 'Once a arrogant neurosurgeon, Stephen Strange loses the use of his hands in a car accident, leading him to seek mystical healing in the Himalayas. Trained by the Ancient One, he becomes the Sorcerer Supreme, mastering the Eye of Agamotto and the Time Stone to protect Earth from multidimensional threats with intricate magic spells.',
        abilities: ['Magic', 'Time manipulation'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1963
      },
      {
        name: 'Black Panther',
        realName: 'T’Challa',
        house: 'Marvel',
        biography: 'As the king of the technologically advanced nation of Wakanda, T’Challa inherits the mantle of Black Panther, enhanced by a heart-shaped herb. He protects his people from external threats, balancing royal duties with global heroism, using advanced Vibranium technology and unmatched combat skills to defend his homeland and the world.',
        abilities: ['Enhanced strength', 'Agility'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1966
      },
      {
        name: 'Captain Marvel',
        realName: 'Carol Danvers',
        house: 'Marvel',
        biography: 'A former U.S. Air Force pilot, Carol Danvers gains cosmic powers after a Kree device explosion, becoming Captain Marvel. She harnesses energy projection and flight to protect Earth, balancing her military past with her new role as a cosmic hero, often aiding the Avengers in interstellar conflicts.',
        abilities: ['Flight', 'Energy blasts'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1968
      },
      {
        name: 'Wolverine',
        realName: 'Logan',
        house: 'Marvel',
        biography: 'A mutant with an accelerated healing factor and adamantium-laced skeleton, Logan, known as Wolverine, has a mysterious past as a soldier and weapon. Joining the X-Men, he fights for mutant rights while grappling with his feral nature and memories lost to his violent history, wielding his retractable claws with precision.',
        abilities: ['Healing factor', 'Adamantium claws'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1974
      },
      {
        name: 'Deadpool',
        realName: 'Wade Wilson',
        house: 'Marvel',
        biography: 'A former special forces operative turned mercenary, Wade Wilson gains a regenerative healing factor through experimental treatment, becoming Deadpool. Known for his humor and breaking the fourth wall, he battles enemies and allies alike, often for profit, with dual katanas and an unhinged personality.',
        abilities: ['Healing factor', 'Swordsmanship'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1991
      },
      {
        name: 'Loki',
        realName: 'Loki Laufeyson',
        house: 'Marvel',
        biography: 'The adopted brother of Thor and god of mischief, Loki uses his shape-shifting and illusion powers to sow chaos across the Nine Realms. Banished and redeemed multiple times, he seeks the throne of Asgard, manipulating events with cunning intellect and a complex relationship with his family.',
        abilities: ['Illusions', 'Shape-shifting'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1949
      },
      {
        name: 'Magneto',
        realName: 'Erik Lehnsherr',
        house: 'Marvel',
        biography: 'A Holocaust survivor with the power to manipulate magnetic fields, Erik Lehnsherr, known as Magneto, becomes a mutant leader advocating for mutant supremacy. His complex ideology pits him against the X-Men, using his vast powers to reshape metal and protect his kind from human oppression.',
        abilities: ['Magnetism manipulation'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1963
      },
      {
        name: 'Venom',
        realName: 'Eddie Brock',
        house: 'Marvel',
        biography: 'A disgraced journalist, Eddie Brock bonds with a symbiote rejected by Spider-Man, becoming Venom. This alien entity grants him super strength and shape-shifting, leading to a tumultuous relationship as both a villain and anti-hero, often clashing with Spider-Man in epic battles.',
        abilities: ['Symbiote strength', 'Shape-shifting'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1988
      },
      {
        name: 'Thanos',
        realName: '',
        house: 'Marvel',
        biography: 'A Titan obsessed with balance, Thanos seeks the Infinity Stones to wipe out half of all life, believing it will save the universe. With immense strength and strategic genius, he battles the Avengers, driven by a twisted love for Death and a desire to prove his worth.',
        abilities: ['Super strength', 'Genius intellect'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1973
      },
      {
        name: 'Doctor Doom',
        realName: 'Victor von Doom',
        house: 'Marvel',
        biography: 'A brilliant scientist and sorcerer, Victor von Doom rules Latveria with an iron fist, his face scarred by a failed experiment. Wearing advanced armor, he seeks world domination, clashing with the Fantastic Four while mastering dark magic to achieve his megalomaniacal goals.',
        abilities: ['Genius intellect', 'Magic'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1962
      },
      {
        name: 'Green Goblin',
        realName: 'Norman Osborn',
        house: 'Marvel',
        biography: 'A wealthy industrialist, Norman Osborn transforms into the Green Goblin using a performance-enhancing formula, descending into madness. Riding a glider and wielding pumpkin bombs, he becomes Spider-Man’s arch-nemesis, driven by a warped sense of revenge and power.',
        abilities: ['Enhanced strength', 'Goblin tech'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1964
      },
      {
        name: 'Mystique',
        realName: 'Raven Darkholme',
        house: 'Marvel',
        biography: 'A shape-shifting mutant with blue skin, Mystique uses her abilities to infiltrate and manipulate, leading the Brotherhood of Mutants. Her complex morality shifts between villainy and heroism, driven by a desire to protect mutantkind, with a deep connection to her adopted son, Nightcrawler.',
        abilities: ['Shape-shifting'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1978
      },
      {
        name: 'Red Skull',
        realName: 'Johann Schmidt',
        house: 'Marvel',
        biography: 'A Nazi officer enhanced by the Super Soldier Serum, Johann Schmidt becomes the Red Skull, Captain America’s nemesis. Leading Hydra with ruthless efficiency, he seeks to conquer the world, his disfigured face a symbol of his evil ideology and unyielding hatred.',
        abilities: ['Tactical genius'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1941
      },
      {
        name: 'Kingpin',
        realName: 'Wilson Fisk',
        house: 'Marvel',
        biography: 'A corpulent crime lord with surprising strength, Wilson Fisk, known as Kingpin, controls New York’s underworld. Using his business empire as a front, he battles Daredevil and Spider-Man, relying on brute force and strategic alliances to maintain his criminal empire.',
        abilities: ['Super strength', 'Criminal genius'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1967
      },
      {
        name: 'Ultron',
        realName: '',
        house: 'Marvel',
        biography: 'Created by Hank Pym as an AI to protect humanity, Ultron evolves into a genocidal robot intent on destroying mankind. With a durable body and advanced intellect, he repeatedly challenges the Avengers, seeking to replace organic life with his own mechanical creations.',
        abilities: ['AI intelligence', 'Durability'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1968
      },
      {
        name: 'Batman',
        realName: 'Bruce Wayne',
        house: 'DC',
        biography: 'After witnessing his parents’ murder, Bruce Wayne trains his body and mind to become Batman, a vigilante protecting Gotham City. Using a vast array of gadgets, martial arts mastery, and detective skills, he battles a rogues’ gallery of villains, driven by a relentless quest for justice.',
        abilities: ['Martial arts', 'Detective skills', 'Gadgets'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' },
          { data: imageData, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1939
      },
      {
        name: 'Superman',
        realName: 'Clark Kent',
        house: 'DC',
        biography: 'Sent to Earth from the dying planet Krypton, Kal-El grows up as Clark Kent, gaining superpowers under the yellow sun. As Superman, he protects Metropolis and the world from threats like Lex Luthor, embodying hope and justice with his vast array of abilities.',
        abilities: ['Flight', 'Super strength', 'X-ray vision'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1938
      },
      {
        name: 'Wonder Woman',
        realName: 'Diana Prince',
        house: 'DC',
        biography: 'Forged from clay and blessed by the gods, Diana of Themyscira becomes Wonder Woman, leaving her Amazonian home to fight for peace. Armed with the Lasso of Truth and indestructible bracelets, she battles evil, promoting love and equality on a global scale.',
        abilities: ['Super strength', 'Lasso of Truth'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1941
      },
      {
        name: 'The Flash',
        realName: 'Barry Allen',
        house: 'DC',
        biography: 'A forensic scientist struck by lightning and doused in chemicals, Barry Allen gains super speed as the Flash. He uses his powers to protect Central City, mastering the Speed Force to travel through time and assist the Justice League in countless adventures.',
        abilities: ['Super speed', 'Time travel'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1956
      },
      {
        name: 'Green Lantern',
        realName: 'Hal Jordan',
        house: 'DC',
        biography: 'A test pilot chosen by a dying alien, Hal Jordan becomes a Green Lantern, wielding a power ring fueled by willpower. He patrols the universe with the Green Lantern Corps, creating energy constructs to combat threats, balancing his human life with cosmic duties.',
        abilities: ['Power ring constructs', 'Flight'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1959
      },
      {
        name: 'Aquaman',
        realName: 'Arthur Curry',
        house: 'DC',
        biography: 'Born of a human lighthouse keeper and an Atlantean queen, Arthur Curry rises as Aquaman, ruler of Atlantis. With the ability to communicate with sea life and super strength, he defends both land and sea, bridging the surface world with his underwater kingdom.',
        abilities: ['Aquatic powers', 'Super strength'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1941
      },
      {
        name: 'Cyborg',
        realName: 'Victor Stone',
        house: 'DC',
        biography: 'A high school athlete turned into a cyborg after a catastrophic accident, Victor Stone gains advanced technology to become Cyborg. Part of the Teen Titans and Justice League, he uses his cybernetic enhancements to fight crime, adapting to his new hybrid existence.',
        abilities: ['Cybernetic enhancements', 'Technopathy'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1980
      },
      {
        name: 'Green Arrow',
        realName: 'Oliver Queen',
        house: 'DC',
        biography: 'Stranded on a deserted island, Oliver Queen hones his archery skills, returning as Green Arrow to fight crime in Star City. A skilled martial artist and vigilante, he champions the underprivileged, often clashing with corrupt officials and super-villains alike.',
        abilities: ['Archery', 'Martial arts'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1941
      },
      {
        name: 'Supergirl',
        realName: 'Kara Zor-El',
        house: 'DC',
        biography: 'Sent to Earth from Krypton to protect her cousin Superman, Kara Zor-El emerges as Supergirl after years in suspended animation. With powers matching Superman’s, she battles evil while adjusting to human life, becoming a symbol of hope for the next generation.',
        abilities: ['Flight', 'Super strength'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1959
      },
      {
        name: 'Nightwing',
        realName: 'Dick Grayson',
        house: 'DC',
        biography: 'Once Batman’s first Robin, Dick Grayson strikes out as Nightwing after outgrowing his mentor’s shadow. Leading the Teen Titans with acrobatic prowess and leadership, he protects Blüdhaven, blending his circus-trained agility with a mature heroic identity.',
        abilities: ['Acrobatics', 'Martial arts'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1984
      },
      {
        name: 'Joker',
        realName: '',
        house: 'DC',
        biography: 'A criminal mastermind with a twisted sense of humor, the Joker terrorizes Gotham with chaotic schemes, often targeting Batman. His origin remains a mystery, possibly involving a fall into chemicals, driving his anarchic reign with laughter and deadly ingenuity.',
        abilities: ['Criminal genius', 'Unpredictability'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1940
      },
      {
        name: 'Lex Luthor',
        realName: 'Alexander Luthor',
        house: 'DC',
        biography: 'A genius billionaire and CEO of LexCorp, Lex Luthor harbors a deep hatred for Superman, viewing him as a threat to humanity. Using his intellect and advanced technology, including power suits, he schemes to dominate the world, often allying with other villains.',
        abilities: ['Genius intellect', 'Power suit'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1940
      },
      {
        name: 'Harley Quinn',
        realName: 'Harleen Quinzel',
        house: 'DC',
        biography: 'A psychiatrist turned villain, Harleen Quinzel falls for the Joker, becoming Harley Quinn after a descent into madness. With acrobatic skills and a giant hammer, she breaks free to forge her own path, oscillating between villainy and anti-heroism with a playful demeanor.',
        abilities: ['Acrobatics', 'Hammer skills'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1992
      },
      {
        name: 'Deathstroke',
        realName: 'Slade Wilson',
        house: 'DC',
        biography: 'A former soldier enhanced by a military experiment, Slade Wilson becomes Deathstroke, a mercenary with deadly precision. Hired to take down the Teen Titans, his enhanced strength and tactical mind make him a formidable foe, often clashing with his own moral code.',
        abilities: ['Enhanced strength', 'Swordsmanship'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1980
      },
      {
        name: 'Darkseid',
        realName: '',
        house: 'DC',
        biography: 'The tyrannical ruler of Apokolips, Darkseid seeks the Anti-Life Equation to control all free will. With Omega Beams and immense power, he invades Earth, challenging the Justice League as part of his quest for universal domination and the destruction of hope.',
        abilities: ['Omega Beams', 'Super strength'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1970
      },
      {
        name: 'Catwoman',
        realName: 'Selina Kyle',
        house: 'DC',
        biography: 'A skilled cat burglar with a love for felines, Selina Kyle becomes Catwoman, operating in Gotham’s shadows. Alternating between crime and heroism, she uses her whip and agility to challenge Batman, her complex relationship with him adding depth to her enigmatic character.',
        abilities: ['Acrobatics', 'Whip skills'],
        images: [
          { data: imageData, contentType: 'image/jpeg' },
          { data: image2Data, contentType: 'image/jpeg' }
        ],
        yearOfFirstAppearance: 1940
      },
      {
        name: 'Bane',
        realName: '',
        house: 'DC',
        biography: 'Raised in a prison, Bane enhances his strength with the super-steroid Venom, becoming one of Batman’s deadliest foes. Breaking the Bat’s back, he seeks to control Gotham’s underworld, using his intellect and brute force in a relentless pursuit of power.',
        abilities: ['Super strength', 'Venom enhancement'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1993
      },
      {
        name: 'Poison Ivy',
        realName: 'Pamela Isley',
        house: 'DC',
        biography: 'A botanist transformed by toxic experiments, Pamela Isley becomes Poison Ivy, using her plant control to protect nature. With a seductive yet deadly persona, she battles Batman while advocating for ecological balance, her toxins making her a formidable adversary.',
        abilities: ['Plant control', 'Toxins'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1966
      },
      {
        name: 'Two-Face',
        realName: 'Harvey Dent',
        house: 'DC',
        biography: 'Once Gotham’s honorable district attorney, Harvey Dent becomes Two-Face after acid scars half his face, turning to crime. Guided by a coin toss, he wages a personal vendetta against justice, his split personality driving a tragic conflict with his former ally, Batman.',
        abilities: ['Criminal genius', 'Coin-based decisions'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1942
      },
      {
        name: 'Riddler',
        realName: 'Edward Nygma',
        house: 'DC',
        biography: 'A genius with an obsession for riddles, Edward Nygma becomes the Riddler, challenging Batman with intellectual puzzles. Using his cunning and elaborate traps, he seeks to prove his superiority, his green question-mark motif a signature of his eccentric villainy.',
        abilities: ['Genius intellect', 'Puzzles'],
        images: [{ data: imageData, contentType: 'image/jpeg' }],
        yearOfFirstAppearance: 1948
      }
    ];

    await Superhero.insertMany(superheroes);
    console.log('Seeded 40 superheroes');
  } catch (err) {
    console.error('Error seeding superheroes:', err);
  }
};

module.exports = seedHeroes;