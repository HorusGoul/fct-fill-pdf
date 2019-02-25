import { NAME_MAP, MONTHS } from "./constants";

const INFO_LINE_INDEX = 1;
const START_ENTRIES_LINE_INDEX = 4;

export function processCsvData(csvLines) {
  if (!validateCsv(csvLines)) {
    throw new Error("Invalid CSV");
  }

  let data = {
    __meta: {
      selected: false
    }
  };

  data = addModuleInfoData(data, csvLines);

  return generatePages(data, csvLines);
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

  const professor = moduleInfoLine[2];
  const mentor = moduleInfoLine[3];
  const alumn = moduleInfoLine[4];

  return {
    ...data,
    [NAME_MAP.professor]: professor,
    [NAME_MAP.mentor]: mentor,
    [NAME_MAP.alumn]: alumn,
    [NAME_MAP.professorSign]: professor,
    [NAME_MAP.mentorSign]: mentor,
    [NAME_MAP.alumnSign]: alumn,
    [NAME_MAP.school]: moduleInfoLine[0],
    [NAME_MAP.company]: moduleInfoLine[1],
    [NAME_MAP.grade]: moduleInfoLine[5],
    [NAME_MAP.gradeType]: moduleInfoLine[6]
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
      [NAME_MAP[`observations${weekDay}`]]: entry[3]
    };

    if (i === csvLines.length - 1) {
      addCurrentPage();
    }
  }

  function addCurrentPage(data) {
    pages = [...pages, currentPage];
    currentPage = { ...basePage };
  }

  return pages.map((page, index) => ({
    ...page,
    [NAME_MAP.sheetNumber]: String(index + 1),
    [NAME_MAP.maxSheets]: String(pages.length)
  }));
}
