import { ludzieFunctions } from "./ludzie/allCards.js";
import { zombiakiFunctions } from "./zombiaki/allCards.js";

export const raceFunctions = { ...ludzieFunctions, ...zombiakiFunctions }

export const cards_zombiaki_json = [
    {
        "id": 1,
        "amount": 1,
        "name": "MIŚ",
        "type": "overlay",
        "overlay_text": "ZAGRAJ MISIA",
        "description": "Połóż Misia na wybranego Zombiaka (z wyjątkiem Psa i Kota). Miś porusza się razem z Zombiakiem. W twojej turze możesz zmniejszyć siłę Misia o 1, aby grający ludźmi odrzucił 2 karty, a nie 1 w najbliższej fazie Odrzucenia. Miś może być atakowany tak jak Zombiak. Grający ludźmi może atakować Zombiaka lub Misia - jeśli Miś otrzyma więcej ran niż ma aktualnie siły, to pozostałe rany otrzymuje Zombiak. Jeśli Zombiak zginie, to Miś ginie razem z nim.",
        "flavor": "Misio chce zombiaczka.",
        "hp": 4,
        "max_hp": 4,
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 2,
        "amount": 2,
        "name": "KLIK",
        "type": "other",
        "description": "Możesz zagrać Klik w turze Ludzi jako odpowiedź na Strzał, Serię lub Snajpera. Klik niweluje działanie jednej takiej karty.",
        "flavor": "Johnowi Rambo się to nie zdarzało.",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 3,
        "amount": 1,
        "name": "WACEK",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Taki sobie, na trzy plus.",
        "hp": 3,
        "max_hp": 3,
        "race": "zombiaki"
    },
    {
        "id": 4,
        "amount": 1,
        "name": "KOT",
        "type": "zombiak",
        "description": "Kot porusza się przed Zombiakami o 1 lub 2 pola w dowolnym kierunku (nie po skosie). Może wejść na pole zajęte przez innego Zombiaka i odwrotnie. Jeśli Kot i Zombiak będą na jednym polu, to Kot pierwszy otrzymuje obrażenia. Trafiony i niezabity Kot nie cofa się. Jeśli Kot otrzyma więcej ran niż potrzeba do jego zabicia, to pozostałe rany otrzymuje Zombiak na tym samym polu. Po dotarciu Kota do Barykady ludzi nic się nie dzieje. Na Kota nie można zagrywać kart z talii zombich.",
        "flavor": "Wlazł kotek na grobek",
        "hp": 2,
        "max_hp": 2,
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 5,
        "amount": 1,
        "name": "KRYSTYNKA",
        "type": "zombiak",
        "description": "Na początku twojej tury przesuń Zombiaka o 1 pole do przodu. Dodatkowo, jeśli w tej samej przecznicy co ona znajduje się inny Zombiak, to nie wolno zagrywać przeciwko niej: Strzałów, Serii, Snajpera, Miotacza, Cegły.",
        "flavor": "Silikon nie gnije.",
        "hp": 3,
        "max_hp": 3,
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 6,
        "amount": 1,
        "name": "ZENEK",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Za życia też go nikt nie lubił.",
        "hp": 3,
        "max_hp": 3,
        "race": "zombiaki"
    },
    {
        "id": 7,
        "amount": 1,
        "name": "ANDRZEJ",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Powróżyć Ci?",
        "hp": 3,
        "max_hp": 3,
        "race": "zombiaki"
    },
    {
        "id": 8,
        "amount": 1,
        "name": "KILOF",
        "type": "other",
        "description": "Odrzuć na Śmietnik dowolną, leżącą na planszy kartę planszy z talii ludzi (z wyjątkiem Dziury).",
        "flavor": "Niestety to mi przeszkadza.",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 9,
        "amount": 3,
        "name": "CZŁOWIEK",
        "type": "overlay",
        "overlay_text": "POŚWIĘĆ CZŁOWIEKA",
        "description": "Połóż Człowieka na dowolnym Zombiaku. Człowiek absorbuje wszystkie obrażenia wynikające z jednej karty zadane temu Zombiakowi, po czym ginie.",
        "flavor": "Do kumpla będziesz strzelał?",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 10,
        "amount": 1,
        "name": "WIADRO",
        "type": "other",
        "description": "Nie możesz tej karty odrzucić. Musisz ją zagrać jako pierwszą kartę w turze, w której ją dociągnąłeś – wybierz dowolnego Zombiaka i porusz go o 1 pole do tyłu. Jeśli żaden Zombiak nie jest w stanie poruszyć się do tyłu, to wybrany przez ciebie Zombiak otrzymuje 1 ranę.",
        "flavor": "Hełm z ograniczoną widocznością.",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 11,
        "amount": 1,
        "name": "STEFAN",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Kwiaty we włosach potargał wiatr...",
        "hp": 4,
        "max_hp": 4,
        "race": "zombiaki"
    },
    {
        "id": 12,
        "amount": 1,
        "name": "MARIUSZ",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Wszystkie Mariusze to fajne chłopaki",
        "hp": 4,
        "max_hp": 4,
        "race": "zombiaki"
    },
    {
        "id": 13,
        "amount": 2,
        "name": "TERROR",
        "type": "other",
        "description": "Grający ludźmi w następnej trze może zagrać tylko jedną kartę",
        "flavor": "Ty! W garniturku! Skądżeś się tu wziął?",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 14,
        "amount": 1,
        "name": "PIES",
        "type": "zombiak",
        "description": "Pies porusza się przed Zombiakami od 1 do 3 pól w dowolnym kierunku (nie po skosie). Po dotarciu Psa do Barykady ludzi nic się nie dzieje. Na Psa nie można zagrywać kart z talii zombich.",
        "flavor": "Najlepszy przyjaciel Zombiaka.",
        "hp": 1,
        "max_hp": 1,
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 15,
        "amount": 1,
        "name": "MŁODY",
        "type": "zombiak",
        "description": "Na początku twojej tury przesuń Zombiaka o 1 pole do przodu. Siła Młodego jest tym większa, im bliżej Barykady się znajduje. Siła 2 (podstawowo), Siła 3 (na IV przecznicy), Siła 4 (na III przecznicy), Siła 5 (na II przecznicy), Siła 6 (na I przecznicy).",
        "flavor": "Jaki Zombiak, taki syn.",
        "hp": 2,
        "max_hp": 4,
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 16,
        "amount": 1,
        "name": "PAZURY",
        "type": "overlay",
        "overlay_text": "DODAJ PAZURY",
        "description": "ZAgraj Pazury na wybranego Zombiaka. Pazury zwiększają siłę Zombiaka o 1.",
        "flavor": "Może małe manicure?",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 17,
        "amount": 1,
        "name": "KAZIMIERZ",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Atrakcyjny to on nie jest.",
        "hp": 3,
        "max_hp": 3,
        "race": "zombiaki"
    },
    {
        "id": 18,
        "amount": 1,
        "name": "KRZYSZTOF",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Mięso armatnie. Raczej tatar niż schabowe.",
        "hp": 2,
        "max_hp": 2,
        "race": "zombiaki"
    },
    {
        "id": 19,
        "amount": 1,
        "name": "BOSS",
        "type": "overlay",
        "overlay_text": "ZAGRAJ BOSSA",
        "description": "Połóż Bossa na dowolnym Zombiaku. Boss może wydać 3 rozkazy (1 na turę) pozwalające na dodatkowy ruch innego Zombiaka. Rozkazów słuchają Zombiaki o sile 3 i mniejszej. Gdy Zombiak-Boss zginie, wszystkie Zombiaki cofają się o 1 pole.",
        "flavor": "Teraz ja tu rządzę.",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 20,
        "amount": 1,
        "name": "MARIAN",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Marian zaprasza do tańca.",
        "hp": 4,
        "max_hp": 4,
        "race": "zombiaki"
    },
    {
        "id": 21,
        "amount": 1,
        "name": "CZESIEK",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Taki mały władca much.",
        "hp": 2,
        "max_hp": 2,
        "race": "zombiaki"
    },
    {
        "id": 22,
        "amount": 1,
        "name": "SYJAMCZYK",
        "type": "zombiak",
        "description": "Na początku twojej tury przesuń Zombiaka o 1 pole do przodu. Dodatkowo, kiedy Syjamczyk zginie, zamienia się w 2 Zombiaki o sile 1 (odwróć jego kartę w miejscu, w którym zginął, a drugą połóż na wolnym polu sąsiadującym z nim z boku lub z tyłu).",
        "flavor": "Co dwie głowy, to nie jedna.",
        "hp": 2,
        "max_hp": 2,
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 23,
        "amount": 1,
        "name": "GALARETA",
        "type": "zombiak",
        "description": "Na początku twojej tury przesuń Zombiaka o 1 pole do przodu. Dodatkowo, kiedy Galareta zostanie zabity, pozostawia w swoim miejscu żeton galarety. Pierwszy Zombiak (z wyjątkiem Psa i Kota), który wejdzie na pole z tym żetonem, zabiera go – dodaje mu on +2 siły.",
        "flavor": "Żelatyna jest dobra na kości.",
        "hp": 3,
        "max_hp": 3,
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 24,
        "amount": 1,
        "name": "GŁÓD",
        "type": "other",
        "description": "Przesuń dowolnego Zombiaka o 1 pole do przodu o ile jest to możliwe",
        "flavor": "Bierz go!",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 25,
        "amount": 1,
        "name": "ARKADIUSZ",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Jak się bawiłeś na mojej stypie?",
        "hp": 3,
        "max_hp": 3,
        "race": "zombiaki"
    },
    {
        "id": 26,
        "amount": 1,
        "name": "MIETEK",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "Setka na wzmocnienie Mietka.",
        "hp": 3,
        "max_hp": 3,
        "race": "zombiaki"
    },
    {
        "id": 27,
        "amount": 2,
        "name": "MASA",
        "type": "other",
        "description": "Przesuń dowolnego Zombiaka na sąsiednie pole zajmowane przez innego Zombiaka (również jeśli obaj są zasieciowani). Obaj traktowani są jak nowy Zombiak o sile równej sumie ich sił. Jeśli zmasujesz Zombiaka z cechą specjalną, to przestaje ona obowiązywać.",
        "flavor": "Kupy nikt nie rusza.",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 28,
        "amount": 1,
        "name": "MIĘSO",
        "type": "other",
        "description": "Wybierz jedną z kart przeciwnika leżących na Barykadzie i odrzuć ją na Śmietnik",
        "flavor": "Łap pan teściową!",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 29,
        "amount": 1,
        "name": "PAPU",
        "type": "other",
        "description": "Usuń do 2 znaczników ran z wybranego Zombiaka.",
        "flavor": "Dietę zaczynam od jutra.",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 30,
        "amount": 1,
        "name": "KOŃ TROJAŃSKI",
        "type": "zombiak",
        "description": "Na początku twojej tury przesuń Zombiaka o 1 pole do przodu. Dodatkowo, kiedy Koń Trojański zginie, zamienia się w 3 Zombiaki o sile 1 (odwróć jego kartę w miejscu, w którym zginął, a pozostałe 2 połóż na wolnych polach sąsiadujących z nim z boku i/lub z tyłu).",
        "flavor": "Zwykła zabawka, zwykła zabawka...",
        "hp": 2,
        "max_hp": 2,
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 31,
        "amount": 1,
        "name": "SPADAJ",
        "type": "other",
        "description": "Zamień miejscami dwa Zombiaki sąsiadujące ze sobą (nie po skosie), o ile żaden z nich nie jest splątany siecią. Karta nie działa na Psa ani Kota.",
        "flavor": "Miejsce dla mądrzejszego!",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 32,
        "amount": 1,
        "name": "UGRYZIENIE",
        "type": "other",
        "description": "Zamień Człowieka w nowego Zombiaka o sile 1, umieść go na sąsiednim polu (z tyłu lub z boku). Jeżeli wszystkie sąsiednie pola są zablokowane, Ugryzienie nie może zostać zagrane.",
        "flavor": "Pajęczyca.",
        "special": true,
        "race": "zombiaki"
    },
    {
        "id": 33,
        "amount": 1,
        "name": "IWAN",
        "type": "zombiak",
        "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
        "flavor": "IWAN: chłopak na piątkę.",
        "hp": 5,
        "max_hp": 5,
        "race": "zombiaki"
    },
    {
        "id": 34,
        "amount": 1,
        "name": "KULOODPORNY",
        "type": "zombiak",
        "description": "Na początku twojej tury przesuń Zombiaka o 1 pole do przodu. Dodatkowo, Kuloodporny ignoruje całkowicie efekty Strzałów.",
        "flavor": "Twardy jak dębowa trumna.",
        "hp": 3,
        "max_hp": 3,
        "special": true,
        "race": "zombiaki"
    }
]

export const cards_ludzie_json = [
    {
        "id": 1,
        "amount": 1,
        "name": "STAĆ",
        "type": "other",
        "description": "Na początku swojej najbliższej tury Zombiaki nie wykonują przymusowego ruchu.",
        "flavor": "Dokumenty poproszę!",
        "race": "ludzie"
    },
    {
        "id": 2,
        "amount": 1,
        "dmg": 2,
        "piercing": true,
        "name": "KRÓTKA SERIA",
        "type": "shot",
        "description": "Krótka seria trafia najbliższego Zombiaka na torze i zadaje 2 rany. Jeśli pierwsza rana zabiła Zombniaka, drugą otrzymuje kolejny Zombiak na torze. Trafienie cofa Zombiaka o 1 pole. Człowiek absorbuje wszystkie pociski Serii.",
        "flavor": "Łykaj kule, aumarlaku!",
        "race": "ludzie"
    },
    {
        "id": 3,
        "amount": 1,
        "dmg": 1,
        "name": "220V",
        "type": "AOE",
        "description": "Zagraj 200V na dowolny tor. Urwany drut wysokiego napięcia zadaje 1 ranę każdemu Zombiakowi znajdującemu się na tym torze.",
        "flavor": "Chyba cię pokopało?",
        "race": "ludzie"
    },
    {
        "id": 4,
        "amount": 7,
        "dmg": 1,
        "name": "STRZAŁ",
        "type": "shot",
        "description": "Strzał trafia najbliższego Zombiaka na wybranym torze i zadaje mu 1 ranę. Dodatkowo, trafiony i niezabity Zombiak cofa się o 1 pole, o ile jest to możliwe.",
        "flavor": "A ten zupełnie za nic!",
        "race": "ludzie"
    },
    {
        "id": 5,
        "amount": 1,
        "dmg": 4,
        "name": "ROPA",
        "type": "AOE",
        "description": "Zagraj Ropę na dowolne pole i (opcjonalnie) wskaż kolejne pola jej działania (nie po skosie). Ropa zadaje łącznie 4 rany. Puste pole pochłania 1 punkt siły rażenia Ropy.",
        "flavor": "A teraz coś z rurociągu Przyjaźń",
        "race": "ludzie"
    },
    {
        "id": 6,
        "amount": 1,
        "name": "DŁUGA SERIA",
        "dmg": 3,
        "piercing": true,
        "type": "shot",
        "description": "Długa seria trafia najbliższego Zombiaka na torze i zadaje 3 rany. Jeśli pierwsza rana zabiła Zombniaka, drugą otrzymuje kolejny Zombiak na torze (itd.). Trafienie cofa Zombiaka o 1 pole. Człowiek absorbuje wszystkie pociski Serii.",
        "flavor": "Hasta la vista, baby!",
        "race": "ludzie"
    },
    {
        "id": 7,
        "amount": 1,
        "name": "RACA ŚWIETLNA",
        "type": "other",
        "description": "Weź maksymalnie 3 karty z wierzchu stosu kart Zombiaków (z wyjątkiem Świtu), odrzuć 1 z nich na Śmietnik, a pozostałe odłóż z powrotem w wybranej kolejności. Dodatkowo dołóż na V przecznicy tyle Zombiaków o sile 1 ile jest możliwe.",
        "flavor": "Zakazuje się używać rac na stadionie.",
        "race": "ludzie"
    },
    {
        "id": 8,
        "amount": 1,
        "name": "SIEĆ",
        "type": "AOE",
        "description": "Zagraj Sieć na sąsiadujące ze sobą Zombiaki (nie po skosie) o łącznej sile 6 lub mniej. Sieć unieruchamia Zombiaki aż do początku następnej tury ludzi.",
        "flavor": "Chyba trochę się zamotałeś.",
        "race": "ludzie"
    },
    {
        "id": 9,
        "amount": 1,
        "name": "ULICA W OGNIU",
        "dmg": 1,
        "type": "AOE",
        "description": "Zagraj tę kartę na jeden dowolny tor oprócz środkowego. Każdy Zombiak na tym torze otrzymuje 1 ranę.",
        "flavor": "I tak był do rozbiórki.",
        "race": "ludzie"
    },
    {
        "id": 10,
        "amount": 3,
        "name": "STRZAŁ. TEN LEPSZY",
        "dmg": 2,
        "piercing": true,
        "type": "shot",
        "description": "Strzał trafia najbliższego Zombiaka na wybranym torze i zadaje mu 2 rany. Dodatkowo trafiony i niezabity Zombiak cofa się o 1 pole, o ile jest to możliwe.",
        "flavor": "Prosto w tę zaropiałą gębę",
        "race": "ludzie"
    },
    {
        "id": 11,
        "amount": 1,
        "name": "BECZKA",
        "type": "object",
        "description": "Wystaw Beczkę na dowolnym polu pierwszej przecznicy. Co turę przesuń ją o 1 pole do przodu. Beczka zabija pierwszego na swojej drodze. Jeśli Zombiak wejdzie na Beczkę, ginie automatycznie. Beczka rozbija się o Mur i Auto, wpada do Dziury, a także detonuję Minę.",
        "flavor": "Wytoczę mocniejszy argument",
        "race": "ludzie"
    },
    {
        "id": 12,
        "amount": 1,
        "name": "JAJNIK",
        "type": "shot",
        "description": "Wybierz tor i wszystkie znajdującie się na nim Zombiaki (z wyjątkiem Psa i Kota) stają się one Zombiakami o sile 1.",
        "flavor": "Bierz ich!",
        "race": "ludzie"
    },
    {
        "id": 13,
        "amount": 1,
        "name": "SNAJPER",
        "dmg": 2,
        "type": "other",
        "description": "Strzał Snajpera trafia dowolnego (niekoniecznie pierwszego na linii strzału) Zombiaka na planszy i zadaje mu 2 rany. Dodatkowo, trafiony i niezabity Zombiak cofa się o 1 pole, o ile jest to możliwe.",
        "flavor": "Już go kiedyś sprzątnąłem...",
        "race": "ludzie"
    },
    {
        "id": 14,
        "amount": 1,
        "name": "GAZ ROZWESELAJĄCY",
        "type": "other",
        "description": "Zagraj Gaz rozweselający na maksymalnie 2 wybrane przez siebie Zombiaki. Przesuń każdego z nich o 1 pole w dowolnym kierunku (nie po skosie), o ile to możliwe.",
        "flavor": "Hi, hi, he, he, ho ,ho!",
        "race": "ludzie"
    },
    {
        "id": 15,
        "amount": 1,
        "name": "DZIURA",
        "type": "object",
        "description": "Wystaw Dziurę na wolnym polu. Gdy wejdzie w nią Zombiak o sile 1 lub 2, automatycznie ginie, a Dziura jest zapełniona (odrzuć ją na Śmietnik). Zombiak o sile 3 lub większej przechodzi przez Dziurę bez szwanku. Karta Człowieka zapełnia Dziurę automatycznie.",
        "flavor": "Zemsta polskich drogowców",
        "race": "ludzie"
    },
    {
        "id": 16,
        "amount": 2,
        "name": "KREW",
        "type": "other",
        "description": "PRzesuń jednego dowolnego Zombiaka w bok na sąsiedny tor, o ile jest możliwe.",
        "flavor": "A rh+. Moja ulubiona.",
        "race": "ludzie"
    },
    {
        "id": 17,
        "amount": 3,
        "name": "ZAPORA",
        "type": "object",
        "description": "Wystaw Zaporę na jednym z niezajętych pół na pierwszej przecznicy. Zapora uniemożliwia jakikolwiek ruch Zombiaków na tym torze. Zapora przestaje działać na początku następnej tury Ludzi.",
        "flavor": "Chodnik chwilowo nieczynny.",
        "race": "ludzie"
    },
    {
        "id": 18,
        "amount": 1,
        "name": "MUR Z RUPIECI",
        "type": "object",
        "hp": 5,
        "description": "Wystaw Mur na wolne pole, z wyjątkiem: pól sąsiadujących (też po skosie) z Zombiakiem; przecznic znajdujących się za Zombiakiem; przecznicy V. Zombiak nie może wejść na Mur, chyba że suma jego siły io wszystkich Zombiaków idących za nim wyniesie 5 lub więcej. Na pola za Murem nie działa Reflektor, Zapora, ani Jajnik.",
        "flavor": "PAnopwie, objazd!",
        "race": "ludzie"
    },
    {
        "id": 19,
        "amount": 1,
        "name": "ZMIATAJ",
        "type": "other",
        "description": "Wybierz jedną z kart przeciwnika leżących na Cmentarzu i odrzuć ją na Śmietnik.",
        "flavor": "Nie, tak się bawić nie będziemy.",
        "race": "ludzie"
    },
    {
        "id": 20,
        "amount": 1,
        "name": "REFLEKTOR",
        "type": "shot",
        "description": "Covnij równocześnie o 1 pole wszystkie Zombiaki na jednym wybranym torze, o ile to możliwe.",
        "flavor": "Parę słów do mikrofonu...",
        "race": "ludzie"
    },
    {
        "id": 21,
        "amount": 1,
        "name": "WYNOCHA",
        "type": "AOE",
        "description": "Cofnij równocześnie o 1 pole wszystkie Zombiaki na planszy. Zombiak cofa się o ile jest za nim wolne pole.",
        "flavor": "Martwym wstęp wzbroniony.",
        "race": "ludzie"
    },
    {
        "id": 22,
        "amount": 1,
        "name": "CHUCK",
        "type": "other",
        "description": "Odrzuć na Śmietnik wierzchnią kartę ze stotsu kart Zombiaków",
        "flavor": "Chuck it out!",
        "race": "ludzie"
    },
    {
        "id": 23,
        "amount": 1,
        "name": "CEGŁA",
        "type": "other",
        "dmg": 1,
        "description": "Cegła trafia dowolnego (niekoniecznie pierwszego na linii strzału) Zombiaka na planszy i zadaje mu 1 ranę. Trafiony Zombiak nie cofa się.",
        "flavor": "Podaj cegłę",
        "race": "ludzie"
    },
    {
        "id": 24,
        "amount": 1,
        "name": "MIOTACZ",
        "type": "shot",
        "dmg": 5,
        "description": "Zagraj Miotacz na najbliższą przecznicę, na której znajduje się jakikolwiek Zombiak. Miotacz zadaje łącznie 5 razn, rozdzielanych przez ludzi (puste pole pochłania 1 punkt siły rażenia Miotacza).",
        "flavor": "Palenie szkodzi zdrowiu.",
        "race": "ludzie"
    },
    {
        "id": 25,
        "amount": 1,
        "name": "MINA",
        "type": "object",
        "dmg": 2,
        "aoe_dmg": 1,
        "activation": ['MIOTACZ', 'ULICA W OGNIU', 'ROPA', 'GRANAT', 'BECZKA', 'AUTO'],
        "description": "Wystaw Minę na wolnym polu, ale nie bezpośrednio przed Zombiakiem. Jeżeli na Minę wejdzie Zombiak, otrzymuje on 2 rany, zaś odłamek razi wybrane sąsiednie pole zadając 1 ranę (nie po skosie). Minę detonuje także Miotacz, Ulica w ogniu, Ropa, Granat, Beczka i Auto.",
        "flavor": "Pamiątka po Szkopach",
        "race": "ludzie"
    },
    {
        "id": 26,
        "amount": 1,
        "name": "MUR",
        "type": "object",
        "hp": 6,
        "description": "Wystaw Mur na wolne pole, z wyjątkiem: pól sąsiadujących (też po skosie) z Zombiakiem; przecznic znajdujących się za Zombiakiem; przecznicy V. Zombiak nie może wejść na Mur, chyba że suma jego siły io wszystkich Zombiaków idących za nim wyniesie 6 lub więcej. Na pola za Murem nie działa Reflektor, Zapora, ani Jajnik.",
        "flavor": "Bez spychacza- zapomnij.",
        "race": "ludzie"
    },
    {
        "id": 27,
        "amount": 1,
        "name": "BETONOWE BUCIKI",
        'type': 'other',
        'dmg': 1,
        "description": "Zagraj Betonowe Buciki na wybranego przez siebie Zombiaka. Za każdym razem, kiedy Zombiak się poruszy (w dowolnym kierunku, również do tyłu), otrzymuję 1 ranę. Człowiek nie chroni w żaden sposób przed Betonowymi bucikami.",
        "flavor": "Na rzeźbę łydek idealne.",
        "race": "ludzie"
    },
    {
        "id": 28,
        "amount": 1,
        "name": "GRANAT",
        'type': 'other',
        "description": "Zagraj Granat na dowolne pole planszy. Granat automatycznie niszczy wszystkie karty znajdujące się na tym polu. Przed Granatem nie chroni Człowiek.",
        "flavor": "Wyrwij zawlęczkę i policz do trzech.",
        "race": "ludzie"
    },
    {
        "id": 29,
        "amount": 1,
        "name": "AUTO",
        'type': "object",
        'dmg': 1,
        'aoe_dmg': 1,
        'activation': ['STRZAŁ', 'STRZAŁ. TEN LEPSZY', 'SNAJPER', 'KRÓTKA SERIA', 'DŁUGA SERIA', 'MIOTACZ', 'ULICA W OGNIU', 'ROPA', 'GRANAT', 'MINA'],
        "description": "Wystaw Auto na dowolnym wolnym polu. Autom można zdetonować za pomocą STrzału, Snajpera, Serii, Miotacza, Ulicy w ogniu, Ropy, Granatu, odłamka Miny. Zdetonowane zadaje 1 ranę na swoim polu i 1 na każdym dookoła (nawet po skosie). Zombiaki mogą wchodzić na pole z Autem.",
        "flavor": "Trabant! Nie trzeba detonatora!",
        "race": "ludzie"
    }
];