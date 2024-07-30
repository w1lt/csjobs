const convertToDate = (dateStr) => {
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const [monthStr, day] = dateStr.split(" ");
  const month = months[monthStr];
  const year = new Date().getFullYear();
  return new Date(year, month, parseInt(day));
};

export default convertToDate;
