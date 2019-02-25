import { triggerDownload } from "./download";
const pdfform = window.pdfform;

const NAME_MAP = {
  weekFrom: "Texto1",
  weekTo: "Texto2",
  month: "Texto3",
  shortYear: "Texto4",
  school: "Texto5",
  professor: "Texto6",
  company: "Texto7",
  mentor: "Texto8",
  alumn: "Texto9",
  grade: "Texto10",
  gradeType: "Cuadro combinado2",
  activity1: "Texto12",
  time1: "Texto13",
  observations1: "Texto14",
  activity2: "Texto15",
  time2: "Texto16",
  observations2: "Texto17",
  activity3: "Texto18",
  time3: "Texto19",
  observations3: "Texto20",
  activity4: "Texto21",
  time4: "Texto22",
  observations4: "Texto23",
  activity5: "Texto24",
  time5: "Texto25",
  observations5: "Texto26",
};

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const INFO_LINE_INDEX = 1;
const START_ENTRIES_LINE_INDEX = 4;

export async function fetchSourcePdf() {
  return fetch("./source.pdf").then(data => data.arrayBuffer());
}

export async function fillPdf(csvLines) {
  if (!validateCsv(csvLines)) {
    throw new Error("Invalid CSV");
  }

  let data = {};
  data = addModuleInfoData(data, csvLines);

  const pdf = await fetchSourcePdf();
  const pages = generatePages(data, csvLines);
  const firstPage = pages[0];

  const filledBuffer = pdfform().transform(pdf, firstPage);

  const blob = new Blob([filledBuffer], { type: "application/pdf" });

  triggerDownload(blob, "test.pdf", "application/pdf");
}

function validateCsv(csvLines) {
  if (!csvLines.length) {
    return false;
  }

  const firstLine = csvLines[0];
  if (firstLine.length < 8) {
    return false;
  }

  return true;
}

function addModuleInfoData(data, csvLines) {
  const moduleInfoLine = csvLines[INFO_LINE_INDEX];

  return {
    ...data,
    [NAME_MAP.school]: moduleInfoLine[0],
    [NAME_MAP.professor]: moduleInfoLine[2],
    [NAME_MAP.company]: moduleInfoLine[1],
    [NAME_MAP.mentor]: moduleInfoLine[3],
    [NAME_MAP.alumn]: moduleInfoLine[4],
    [NAME_MAP.grade]: moduleInfoLine[5],
    [NAME_MAP.gradeType]: moduleInfoLine[6],
  };
}

function generatePages(basePage, csvLines) {
  let currentPage = { ...basePage };
  let pages = [];
  let lastWeekStart;
  let isFirstWeek = true;

  for (let i = START_ENTRIES_LINE_INDEX; i < csvLines.length; i++) {
    const entry = csvLines[i];

    const dateArr = entry[0].split("/");
    const date = new Date(`${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`);
    const weekDay = date.getDay();
    const day = date.getDate();
    const weekFrom = new Date(
      date.getTime() - 1000 * 3600 * 24 * (weekDay - 1)
    ).getDate();

    if (isFirstWeek) {
      lastWeekStart = weekFrom;
      isFirstWeek = false;
    }

    if (lastWeekStart !== weekFrom) {
      addCurrentPage();
      lastWeekStart = weekFrom;
    }

    currentPage = {
      ...currentPage,
      [NAME_MAP.weekFrom]: String(weekFrom),
      [NAME_MAP.weekTo]: String(
        weekDay === 0
          ? day
          : new Date(
              date.getTime() + 1000 * 3600 * 24 * (7 - weekDay)
            ).getDate()
      ),
      [NAME_MAP.month]: MONTHS[date.getMonth()],
      [NAME_MAP.shortYear]: String(date.getFullYear() % 100),
      [NAME_MAP[`activity${weekDay}`]]: entry[2],
      [NAME_MAP[`time${weekDay}`]]: entry[1],
      [NAME_MAP[`observations${weekDay}`]]: entry[3],
    };

    if (i === csvLines.length - 1) {
      addCurrentPage();
    }
  }

  function addCurrentPage(data) {
    pages = [...pages, currentPage];
    currentPage = { ...basePage };
  }

  return pages;
}
