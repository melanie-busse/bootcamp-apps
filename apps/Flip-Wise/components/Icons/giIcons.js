import * as GiIcons from "react-icons/gi";

const ICON_DATA = [
    { "name": "GiAtom", "label": "Physik" },
    { "name": "GiBookmark", "label": "Literatur" },
    { "name": "GiCalculator", "label": "Mathematik" },
    { "name": "GiCarKey", "label": "Autos" },
    { "name": "GiChessKnight", "label": "Schach" },
    { "name": "GiCookingPot", "label": "Kochen" },
    { "name": "GiDna1", "label": "Biologie" },
    { "name": "GiEarthAmerica", "label": "Geografie" },
    { "name": "GiFilmStrip", "label": "Film" },
    { "name": "GiGraduateCap", "label": "Bildung" },
    { "name": "GiMedicalPack", "label": "Medizin" },
    { "name": "GiMicrophone", "label": "Musik" },
    { "name": "GiMountainRoad", "label": "Natur" },
    { "name": "GiMusicalNotes", "label": "Musik 2" },
    { "name": "GiPaintBrush", "label": "Kunst" },
    { "name": "GiPuzzle", "label": "Rätsel" },
    { "name": "GiRobotGolem", "label": "Robotik" },
    { "name": "GiSoccerBall", "label": "Sport" },
    { "name": "GiSpellBook", "label": "Sprachen" },
];

export const ICONS = ICON_DATA.map((icon) => ({
    ...icon,
    Icon: GiIcons[icon.name],
}));